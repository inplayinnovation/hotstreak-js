import API from './graphql/api';
import JWT from './jwt';
import { marketIdToJson } from './helpers';
import Pusher from 'pusher-js';

class HotStreak {
  constructor(options) {
    const { baseUrl, key, secret, subject } = options;
    const token = options.token || JWT.sign(key, subject, secret);

    this._baseUrl = baseUrl;
    this._headers = {
      Authorization: `Bearer ${token}`
    };

    this._api = new API(this._baseUrl, this._headers);
  }

  async _initializePusherClient() {
    if (this._pusher) {
      return;
    }

    const {
      gamesChannel,
      pusherAppKey,
      pusherCluster
    } = await this._api.systemQuery();

    this._gamesChannel = gamesChannel;
    this._pusher = new Pusher(pusherAppKey, {
      auth: { headers: this._headers },
      authEndpoint: this._baseUrl + '/pusher/auth',
      cluster: pusherCluster
    });
  }

  predict(
    game,
    market,
    predictedOutcome,
    submarketIndex = 0,
    checkExpectations = false,
    meta
  ) {
    const predictPayload = {
      gameId: game.id,
      marketId: market.id,
      meta: JSON.stringify(meta),
      predictedOutcome,
      submarketIndex
    };

    if (checkExpectations) {
      predictPayload.expectedLine = market.lines[submarketIndex];
      predictPayload.expectedProbability = market.probabilities[submarketIndex];
      predictPayload.expectedDuration = market.durations[submarketIndex];
    }

    return this._api.predictMutation(predictPayload);
  }

  fetchGames() {
    return this._api.gamesQuery();
  }

  fetchPredictions(page = 1, meta) {
    return this._api.predictionsQuery(page, JSON.stringify(meta));
  }

  async subscribeToChannel(channelName, callback) {
    await this._initializePusherClient();
    const channel = this._pusher.subscribe(channelName);
    channel.bind('update', data => {
      const { clocks, id, event, markets, scores, status, timestamp } = data;

      const fixedScores = {};
      Object.keys(scores).forEach(opponentId => {
        fixedScores[`Opponent:${opponentId}`] = scores[opponentId];
      });

      const { clock, elapsed, period } = clocks.game;

      if (this._lastTimestamp && timestamp < this._lastTimestamp) {
        return;
      }

      this._lastTimestamp = timestamp;

      const gameId = `Game:${id}`;
      const game = {
        __typename: 'Game',
        id: gameId,
        clock,
        elapsed,
        event,
        opponents: Object.keys(fixedScores).map(id => ({
          __typename: 'Opponent',
          id,
          score: fixedScores[id]
        })),
        period,
        scores: fixedScores,
        status
      };

      if (data.situation) {
        const {
          down,
          distance,
          id,
          location_id,
          possession_id,
          yardline
        } = data.situation;
        const situation = {
          __typename: 'Situation',
          id,
          down,
          distance,
          location: {
            __typename: 'Opponent',
            id: location_id
          },
          possession: {
            __typename: 'Opponent',
            id: possession_id
          },
          yardline
        };
        game.situation = situation;
      }

      const parsedMarkets = Object.keys(markets).map(id => {
        const [probabilities, lines, durations, affinity] = markets[id].split(
          '|'
        );

        const market = {
          __typename: 'Market',
          id,
          affinity: parseFloat(affinity),
          durations: durations ? durations.split(',').map(parseFloat) : null,
          game: {
            __typename: 'Game',
            id: gameId
          },
          lines: lines.split(',').map(parseFloat),
          probabilities: probabilities.split(',').map(parseFloat)
        };

        Object.assign(market, marketIdToJson(id));

        return market;
      });

      callback(game, parsedMarkets);
    });
  }

  async subscribeToAllGames(callback) {
    if (!this._gamesChannel) {
      await this._initializePusherClient();
    }

    return this.subscribeToChannel(this._gamesChannel, callback);
  }

  unsubscribeFromChannel(channelName) {
    this._pusher.unsubscribe(channelName);
  }
}

export default HotStreak;

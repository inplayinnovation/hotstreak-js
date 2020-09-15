import API from './graphql/api';
import JWT from './jwt';
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
    subMarketIndex = 0,
    checkExpectations = false,
    meta
  ) {
    const predictPayload = {
      gameId: game.id,
      marketId: market.id,
      meta: JSON.stringify(meta),
      predictedOutcome
    };

    if (checkExpectations) {
      predictPayload.expectedLine = market.lines[subMarketIndex];
      predictPayload.expectedProbability = market.probabilities[subMarketIndex];
      predictPayload.expectedDuration = market.durations[subMarketIndex];
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
        opponents: Object.keys(scores).map(id => ({
          __typename: 'Opponent',
          id: `Opponent:${id}`,
          score: scores[id]
        })),
        period,
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
        const [targetId, category, position = null] = id.split(',');
        return {
          __typename: 'Market',
          id,
          affinity: parseFloat(affinity),
          category,
          durations: durations ? durations.split(',').map(parseFloat) : null,
          game: {
            __typename: 'Game',
            id: gameId
          },
          lines: lines.split(',').map(parseFloat),
          position,
          probabilities: probabilities.split(',').map(parseFloat),
          target: {
            __typename: targetId.split(':')[0],
            id: targetId
          }
        };
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
}

export default HotStreak;

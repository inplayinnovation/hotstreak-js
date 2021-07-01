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

    const { gamesChannel, pusherAppKey, pusherCluster } =
      await this._api.systemQuery();

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

  fetchGame(id) {
    return this._api.gameQuery(id);
  }

  fetchGames(status) {
    return this._api.gamesQuery(status);
  }

  fetchMarket(gameId, marketId) {
    return this._api.marketQuery(gameId, marketId);
  }

  fetchPrediction(predictionId) {
    return this._api.predictionQuery(predictionId);
  }

  fetchPredictions(page = 1, meta) {
    return this._api.predictionsQuery(page, JSON.stringify(meta));
  }

  async subscribeToGame(game, callback) {
    await this._initializePusherClient();
    const channel = this._pusher.subscribe(game.broadcastChannel);
    channel.bind('update', gameUpdate => {
      this._handleGameUpdate(gameUpdate, callback);
    });
  }

  async subscribeToAllGames(callback) {
    await this._initializePusherClient();
    const channel = this._pusher.subscribe(this._gamesChannel);
    channel.bind('update_batch', ({ batch }) => {
      batch.forEach(gameUpdate => this._handleGameUpdate(gameUpdate, callback));
    });
  }

  _formatAtBat(atBat) {
    const {
      balls,
      hitter,
      order,
      outs,
      pitchCount,
      pitcher,
      runners,
      strikes
    } = atBat;
    return {
      __typename: 'AtBat',
      balls,
      hitter: {
        __typename: 'Participant',
        id: hitter.id
      },
      order,
      outs,
      pitchCount,
      pitcher: {
        __typename: 'Participant',
        id: pitcher.id
      },
      runners,
      strikes
    };
  }

  _handleGameUpdate(gameUpdate, callback) {
    const {
      clocks,
      id,
      event,
      last_away_at_bat,
      last_home_at_bat,
      lineup,
      situation,
      scores,
      status,
      timestamp
    } = gameUpdate;
    const markets = gameUpdate.markets || {};

    if (this._lastTimestamp && timestamp < this._lastTimestamp) {
      return;
    }
    this._lastTimestamp = timestamp;

    const fixedScores = {};
    Object.keys(scores).forEach(opponentId => {
      fixedScores[`Opponent:${opponentId}`] = scores[opponentId];
    });

    const { clock, elapsed, period } = clocks.game;

    const gameId = `Game:${id}`;
    const game = {
      __typename: 'Game',
      id: gameId,
      clock,
      elapsed,
      opponents: Object.keys(fixedScores).map(id => ({
        __typename: 'Opponent',
        id,
        score: fixedScores[id]
      })),
      period,
      scores: fixedScores,
      status
    };

    if (event) {
      game.event = event;
    }

    if (last_away_at_bat) {
      game.lastAwayAtBat = this._formatAtBat(last_away_at_bat);
    }

    if (last_home_at_bat) {
      game.lastHomeAtBat = this._formatAtBat(last_home_at_bat);
    }

    if (lineup) {
      game.lineup = lineup;
    }

    if (situation) {
      const { down, distance, id, location_id, possession_id, yardline } =
        situation;
      game.situation = {
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
    }

    const parsedMarkets = Object.keys(markets).map(id => {
      const [probabilities, lines, durations, affinity] =
        markets[id].split('|');

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
  }

  unsubscribeFromChannel(channelName) {
    this._pusher.unsubscribe(channelName);
  }
}

export default HotStreak;

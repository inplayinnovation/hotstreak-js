import API from './graphql/api';
import { Base64 } from 'js-base64';
import JWT from './jwt';
import { marketIdToJson } from './helpers';
import pako from 'pako';
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

  fetchLeague(id) {
    return this._api.leagueQuery(id);
  }

  fetchLeagues() {
    return this._api.leaguesQuery();
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

  _decompressIfNeeded({ data, format }) {
    if (format === 'json') {
      return JSON.parse(data);
    }

    return JSON.parse(
      pako.inflate(
        Base64.atob(data)
          .split('')
          .map(e => e.charCodeAt(0)),
        { to: 'string' }
      )
    );
  }

  async subscribeToGame(game, callback) {
    await this._initializePusherClient();
    const { broadcastChannel } = game;
    const channel = this._pusher.subscribe(broadcastChannel);
    channel.bind('update', payload => {
      const gameUpdate = this._decompressIfNeeded(payload);
      this._handleGameUpdate(gameUpdate, callback);
    });
  }

  async subscribeToLeague(league, callback) {
    await this._initializePusherClient();
    const { broadcastChannel } = league;
    const channel = this._pusher.subscribe(broadcastChannel);
    channel.bind('update_batch', payload => {
      const { batch } = this._decompressIfNeeded(payload);
      batch.forEach(gameUpdate => this._handleGameUpdate(gameUpdate, callback));
    });
  }

  _formatAtBat(atBat) {
    const { balls, hitter, pitch_count: pitchCount, pitcher, strikes } = atBat;
    return {
      __typename: 'AtBat',
      balls,
      hitter: {
        __typename: 'Participant',
        id: hitter.id
      },
      pitchCount,
      pitcher: {
        __typename: 'Participant',
        id: pitcher.id
      },
      strikes
    };
  }

  _handleGameUpdate(gameUpdate, callback) {
    const {
      at_bat: atBat,
      clocks,
      current_drive: currentDrive,
      id,
      event,
      lineup,
      markets,
      pitch_counts: pitchCounts,
      runners,
      scores,
      status,
      timestamp
    } = gameUpdate;

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

    if (atBat) {
      game.atBat = this._formatAtBat(atBat);
    }

    if (lineup) {
      game.lineup = lineup;
    }

    if (pitchCounts) {
      game.pitchCounts = pitchCounts;
    }

    if (runners) {
      game.runners = runners;
    }

    if (currentDrive) {
      const { current_play: currentPlay, id, possession } = currentDrive;
      game.currentDrive = {
        __typename: 'Drive',
        id,
        possession: {
          __typename: 'Opponent',
          id: possession.id
        }
      };

      if (currentPlay) {
        const {
          id,
          down,
          distance,
          yard_line: yardLine,
          location
        } = currentPlay;
        game.currentDrive.currentPlay = {
          __typename: 'Play',
          id,
          down,
          distance,
          location: {
            __typename: 'Opponent',
            id: location.id
          },
          yardLine
        };
      }
    }

    let parsedMarkets;
    if (markets) {
      parsedMarkets = Object.keys(markets).map(id => {
        const [probabilities, lines, durations, affinity, options] =
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
          options: parseInt(options),
          probabilities: probabilities.split(',').map(parseFloat)
        };

        Object.assign(market, marketIdToJson(id));

        return market;
      });
    }

    callback(game, parsedMarkets);
  }

  unsubscribeFromChannel(channelName) {
    if (this._pusher) {
      this._pusher.unsubscribe(channelName);
    }
  }
}

export default HotStreak;

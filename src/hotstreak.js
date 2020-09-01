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

  predict(game, market, predictedOutcome, checkExpectations = true) {
    const predictPayload = {
      gameId: game.id,
      marketId: market.id,
      predictedOutcome
    };

    if (checkExpectations) {
      predictPayload['expectedLine'] = market.line;
      predictPayload['expectedProbability'] = market.probability;
      predictPayload['expectedDuration'] = market.duration;
    }

    return this._api.predictMutation(predictPayload);
  }

  fetchGames() {
    return this._api.gamesQuery();
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

      const game = {
        id: `Game:${id}`,
        clock,
        elapsed,
        event,
        period,
        status,
        opponents: Object.keys(scores).map(id => ({
          id: `Opponent:${id}`,
          score: scores[id]
        }))
      };

      const parsedMarkets = Object.keys(markets).map(id => {
        const [probability, line, duration] = markets[id].split(',');
        const [target, category, position = null] = id.split(',');
        return {
          id,
          target,
          lines: [parseFloat(line)],
          probabilities: [parseFloat(probability)],
          durations: [parseFloat(duration)],
          category,
          position
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

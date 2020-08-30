import API from './graphql/api';
import JWT from './jwt';
import { parseMarket } from './helpers';
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

  async fetchGames() {
    return this._api.gamesQuery();
  }

  async subscribeToChannel(channelName, callback) {
    await this._initializePusherClient();
    const channel = this._pusher.subscribe(channelName);
    channel.bind('update', data => {
      const {
        clocks,
        id,
        event,
        predictions,
        scores,
        status,
        timestamp
      } = data;

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

      callback(game, predictions.map(parseMarket));
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

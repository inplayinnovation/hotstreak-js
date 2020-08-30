import API from './graphql/api';
import { parseMarket } from './helpers';
import Pusher from 'pusher-js';

class HotStreak {
  constructor(options) {
    const { baseUrl, key, secret, subject, token } = options;

    this._baseUrl = baseUrl;
    this._key = key;
    this._secret = secret;
    this._subject = subject;
    this._token = token;
  }

  async _initializeAPI() {
    if (this._api) {
      return;
    }

    let token = this._token;
    if (!token) {
      const jwt = await import('jsonwebtoken');
      token = jwt.sign({ iss: this._key, subject: this._subject }, this._secret);
    }

    this._headers = {
      Authorization: `Bearer ${token}`
    };

    this._api = new API(this._baseUrl, this._headers);
  }

  async _initializePusherClient() {
    if (this._pusher) {
      return;
    }

    await this._initializeAPI();

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
    await this._initializeAPI();
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

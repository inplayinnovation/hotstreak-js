import API from './graphql/api';
import jwt from 'jsonwebtoken';
import Pusher from 'pusher-js';
import Store from './store';

class HotStreak {
  constructor(options) {
    const { baseUrl, key, secret, subject } = options;
    const token = options.token || jwt.sign({ iss: key, subject }, secret);

    this._baseUrl = baseUrl;
    this._headers = {
      Authorization: `Bearer ${token}`
    };

    this._api = new API(this._baseUrl, this._headers);
    this._store = new Store();
  }

  async _initializePusherClient() {
    if (this._pusher) {
      return;
    }

    const { pusherAppKey, pusherCluster } = await this._api.systemQuery();
    this._pusher = new Pusher(pusherAppKey, {
      auth: { headers: this._headers },
      authEndpoint: this._baseUrl + 'pusher/auth',
      cluster: pusherCluster
    });
  }

  async fetchGames() {
    const games = await this._api.gamesQuery();
    return this._store.pushGames(games);
  }

  async subscribeToGame(gameId, callback) {
    callback(this._store.entities);

    await this._initializePusherClient();
    const game = this._store.entities.games[gameId];
    const channel = this._pusher.subscribe(game.broadcastChannel);
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

      const gameId = `Game:${id}`;
      Object.assign(this._store.entities.games[gameId], {
        clock,
        elapsed,
        event,
        period,
        status
      });

      for (const [key, value] of Object.entries(scores)) {
        const opponentId = `Opponent:${key}`;
        this._store.entities.opponents[opponentId].score = value;
      }

      this._store.pushPredictions(predictions, gameId);

      callback(this._store.entities);
    });
  }
}

export default HotStreak;

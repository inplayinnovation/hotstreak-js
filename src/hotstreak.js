import API from './graphql/api';
import jwt from 'jsonwebtoken';
import { parsePrediction } from './helpers';
import Pusher from 'pusher-js';

class HotStreak {
  constructor(options) {
    const { baseUrl, key, secret, subject } = options;
    const token = options.token || jwt.sign({ iss: key, subject }, secret);

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

    const { gamesChannel, pusherAppKey, pusherCluster } = await this._api.systemQuery();
    this._gamesChannel = gamesChannel;
    this._pusher = new Pusher(pusherAppKey, {
      auth: { headers: this._headers },
      authEndpoint: this._baseUrl + 'pusher/auth',
      cluster: pusherCluster
    });
  }

  async fetchGames() {
    this._games = {};

    const games = await this._api.gamesQuery();
    games.forEach(game => {
      this._games[game.id] = game;
    });

    return games;
  }

  async _subscribeToChannel(channelName, callback) {
    await this.fetchGames();
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

      const gameId = `Game:${id}`;
      Object.assign(this._games[gameId], {
        clock,
        elapsed,
        event,
        period,
        status
      });

      this._games[gameId].opponents.forEach(opponent => {
        const opponentId = opponent.id.split(':')[1];
        opponent.score = scores[opponentId];
      });

      callback(this._games[gameId], predictions.map(parsePrediction));
    });
  }

  async subscribeToGame(gameId, callback) {
    const game = this._games[gameId];
    this._subscribeToChannel(game.broadcastChannel, callback);
  }

  async subscribeToGames(callback) {
    if (!this._gamesChannel) {
      await this._initializePusherClient();
    }

    this._subscribeToChannel(this._gamesChannel, callback);
  }
}

export default HotStreak;

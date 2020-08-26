import { GraphQLClient } from 'graphql-request';
import Pusher from 'pusher-js';

import { GAMES_QUERY } from './queries';

const BASE_URL = 'https://ft-api-staging.herokuapp.com/';

const GRAPHQL_ENDPOINT = BASE_URL + 'graphql';
const PUSHER_AUTH_ENDPOINT = BASE_URL + 'pusher/auth';

const GAMES_CHANNEL = 'private-ft-api-staging-games';

const PUSHER_APP_KEY = '383bdae328e791882d83';
const PUSHER_CLUSTER = 'us3';

class HotStreak {
  constructor(haasToken) {
    this._haasToken = haasToken;

    const headers = {
      Authorization: `Bearer ${haasToken}`
    };

    this.graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, { headers });
    this._pusherClient = new Pusher(PUSHER_APP_KEY, {
      auth: { headers },
      authEndpoint: PUSHER_AUTH_ENDPOINT,
      cluster: PUSHER_CLUSTER
    });
  }

  async fetchGames() {
    this._games = {};

    const { games } = await this.graphQLClient.request(GAMES_QUERY);
    games.forEach(game => {
      this._games[game.id] = game;
    });
  }

  async subscribe(callback) {
    await this.fetchGames();

    Object.values(this._games).forEach(game => callback(game));

    const channel = this._pusherClient.subscribe(GAMES_CHANNEL);
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

      const parsePrediction = prediction => {
        const [affinity, signature] = prediction;
        const [predictionComponents] = signature.split(':');
        const [
          participantId,
          beginClock,
          endClock,
          line,
          overProbability,
          statCategory,
          predictedAt
        ] = predictionComponents.split(',');

        return {
          affinity,
          beginClock: parseInt(beginClock),
          endClock: parseInt(endClock),
          line: parseFloat(line),
          overProbability: parseFloat(overProbability),
          participant: `Participant:${participantId}`,
          predictedAt: parseFloat(predictedAt),
          signature,
          statCategory
        };
      };

      callback(this._games[gameId], predictions.map(parsePrediction));
    });
  }
}

export default HotStreak;

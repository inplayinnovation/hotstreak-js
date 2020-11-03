import { GraphQLClient } from 'graphql-request';

import { GAMES_QUERY, PREDICTIONS_QUERY, SYSTEM_QUERY } from './queries';
import { marketIdToJson } from '../helpers';
import { PREDICT_MUTATION } from './mutations';

class API {
  constructor(baseUrl, headers) {
    this._graphQLClient = new GraphQLClient(baseUrl + '/graphql', { headers });
  }

  async gamesQuery() {
    const { games } = await this._graphQLClient.request(GAMES_QUERY);
    games.forEach(game => {
      game.markets.forEach(market => {
        Object.assign(market, marketIdToJson(market.id));
        market.game = {
          __typename: 'Game',
          id: game.id
        };
      });
      game.opponents.forEach(opponent => {
        opponent.score = game.scores[opponent.id];
      });
    });
    return games;
  }

  async predictionsQuery(page, meta) {
    const variables = { meta, page };
    const { predictions } = await this._graphQLClient.request(
      PREDICTIONS_QUERY,
      variables
    );

    predictions.forEach(prediction => {
      if (prediction.opponent) {
        prediction.target = prediction.opponent;
      } else if (prediction.participant) {
        prediction.target = prediction.participant;
      }
      delete prediction.opponent;
      delete prediction.participant;
    });

    return predictions;
  }

  async systemQuery() {
    const { system } = await this._graphQLClient.request(SYSTEM_QUERY);
    return system;
  }

  async predictMutation(variables) {
    const { predict: prediction } = await this._graphQLClient.request(
      PREDICT_MUTATION,
      variables
    );
    return prediction;
  }
}

export default API;

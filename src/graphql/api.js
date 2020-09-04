import { GraphQLClient } from 'graphql-request';

import { GAMES_QUERY, PREDICTIONS_QUERY, SYSTEM_QUERY } from './queries';
import { PREDICT_MUTATION } from './mutations';

class API {
  constructor(baseUrl, headers) {
    this._graphQLClient = new GraphQLClient(baseUrl + '/graphql', { headers });
  }

  async gamesQuery() {
    const { games } = await this._graphQLClient.request(GAMES_QUERY);
    games.forEach(game => {
      game.markets.forEach(market => {
        const [targetId, category, position = null] = market.id.split(',');
        market.category = category;
        market.game = {
          __typename: 'Game',
          id: game.id
        };
        market.position = position;
        market.target = {
          __typename: targetId.split(':')[0],
          id: targetId
        };
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

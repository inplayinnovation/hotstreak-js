import { GraphQLClient } from 'graphql-request';

import { GAMES_QUERY, SYSTEM_QUERY } from './queries';
import { PREDICT_MUTATION } from './mutations';

class API {
  constructor(baseUrl, headers) {
    this._graphQLClient = new GraphQLClient(baseUrl + '/graphql', { headers });
  }

  async gamesQuery() {
    const { games } = await this._graphQLClient.request(GAMES_QUERY);
    return games;
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

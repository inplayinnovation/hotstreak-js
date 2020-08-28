import { GraphQLClient } from 'graphql-request';

import { GAMES_QUERY, SYSTEM_QUERY } from './queries';

class API {
  constructor(baseUrl, headers) {
    this._graphQLClient = new GraphQLClient(baseUrl + 'graphql', { headers });
  }

  async gamesQuery() {
    const { games } = await this._graphQLClient.request(GAMES_QUERY);
    return games;
  }

  leaguesQuery() {
    //
  }

  async systemQuery() {
    const { system } = await this._graphQLClient.request(SYSTEM_QUERY);
    return system;
  }
}

export default API;

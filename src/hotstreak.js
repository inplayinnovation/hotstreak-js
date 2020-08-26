import { GraphQLClient } from 'graphql-request';

import { GAMES_QUERY } from './queries';

const HAAS_URL = 'https://ft-api-staging.herokuapp.com/graphql';

class HotStreak {
  constructor(haasToken) {
    this._haasToken = haasToken;
    this.graphQLClient = new GraphQLClient(HAAS_URL, {
      headers: {
        Authorization: `Bearer ${haasToken}`,
      },
    });
  }

  async fetchGames() {
    const foo = await this.graphQLClient.request(GAMES_QUERY);
    console.log(foo);
  }
}

export default HotStreak;

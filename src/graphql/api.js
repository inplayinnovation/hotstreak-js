import { GraphQLClient } from 'graphql-request';

import {
  GAME_QUERY,
  LEAGUE_QUERY,
  LEAGUES_QUERY,
  MARKET_QUERY,
  PREDICTION_QUERY,
  PREDICTIONS_QUERY,
  SYSTEM_QUERY
} from './queries';
import { marketIdToJson } from '../helpers';
import { PREDICT_MUTATION } from './mutations';

class API {
  constructor(baseUrl, headers) {
    this._graphQLClient = new GraphQLClient(baseUrl + '/graphql', { headers });
  }

  _fixGame(game) {
    (game.markets || []).forEach(market => {
      Object.assign(market, marketIdToJson(market.id));
      market.game = {
        __typename: 'Game',
        id: game.id
      };
    });
    game.opponents.forEach(opponent => {
      opponent.score = game.scores[opponent.id];
    });
  }

  async gameQuery(id) {
    const variables = { id };
    const { game } = await this._graphQLClient.request(GAME_QUERY, variables);
    this._fixGame(game);
    return game;
  }

  async leagueQuery(id) {
    const variables = { id };
    const { league } = await this._graphQLClient.request(
      LEAGUE_QUERY,
      variables
    );
    league.games.forEach(this._fixGame);
    return league;
  }

  async leaguesQuery() {
    const { leagues } = await this._graphQLClient.request(LEAGUES_QUERY);
    leagues.forEach(league => league.games.forEach(this._fixGame));
    return leagues;
  }

  async marketQuery(gameId, marketId) {
    const variables = { gameId, marketId };
    const { market } = await this._graphQLClient.request(
      MARKET_QUERY,
      variables
    );
    return market;
  }

  async predictionQuery(predictionId) {
    const variables = { predictionId };
    const { prediction } = await this._graphQLClient.request(
      PREDICTION_QUERY,
      variables
    );
    return prediction;
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
      } else if (prediction.scoreCard) {
        prediction.target = prediction.scoreCard;
      }
      delete prediction.opponent;
      delete prediction.participant;
      delete prediction.scoreCard;
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

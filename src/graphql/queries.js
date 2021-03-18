import { gql } from 'graphql-request';

import {
  GAME_FRAGMENT,
  HOLE_FRAGMENT,
  LEAGUE_FRAGMENT,
  MARKET_FRAGMENT,
  OPPONENT_FRAGMENT,
  PARTICIPANT_FRAGMENT,
  PLAYER_FRAGMENT,
  PREDICTION_FRAGMENT,
  SCORECARD_FRAGMENT,
  SITUATION_FRAGMENT,
  TOURNAMENT_FRAGMENT
} from './fragments';

const GAME_QUERY = gql`
  query GameQuery($id: ID!) {
    game(id: $id) {
      ...GameFragment
      league {
        ...LeagueFragment
      }
      markets {
        ...MarketFragment
      }
      opponents {
        ...OpponentFragment
        participants {
          ...ParticipantFragment
          player {
            ...PlayerFragment
          }
        }
      }
      ... on FootballGame {
        situation {
          ...SituationFragment
        }
      }
      ... on GolfGame {
        tournament {
          ...TournamentFragment
          holes {
            ...HoleFragment
          }
        }
      }
    }
  }
  ${GAME_FRAGMENT}
  ${LEAGUE_FRAGMENT}
  ${MARKET_FRAGMENT}
  ${OPPONENT_FRAGMENT}
  ${PARTICIPANT_FRAGMENT}
  ${PLAYER_FRAGMENT}
  ${SITUATION_FRAGMENT}
  ${TOURNAMENT_FRAGMENT}
  ${HOLE_FRAGMENT}
`;

const LIGHT_GAMES_QUERY = gql`
  query LightGamesQuery {
    games {
      ...GameFragment
      league {
        ...LeagueFragment
      }
      opponents {
        ...OpponentFragment
      }
      ... on FootballGame {
        situation {
          ...SituationFragment
        }
      }
      ... on GolfGame {
        tournament {
          ...TournamentFragment
          holes {
            ...HoleFragment
          }
        }
      }
    }
  }
  ${GAME_FRAGMENT}
  ${LEAGUE_FRAGMENT}
  ${OPPONENT_FRAGMENT}
  ${SITUATION_FRAGMENT}
  ${TOURNAMENT_FRAGMENT}
  ${HOLE_FRAGMENT}
`;

const HEAVY_GAMES_QUERY = gql`
  query HeavyGamesQuery($status: String) {
    games(status: $status) {
      ...GameFragment
      league {
        ...LeagueFragment
      }
      markets {
        ...MarketFragment
      }
      opponents {
        ...OpponentFragment
        participants {
          ...ParticipantFragment
          player {
            ...PlayerFragment
          }
        }
      }
      ... on FootballGame {
        situation {
          ...SituationFragment
        }
      }
      ... on GolfGame {
        tournament {
          ...TournamentFragment
          holes {
            ...HoleFragment
          }
        }
      }
    }
  }
  ${GAME_FRAGMENT}
  ${LEAGUE_FRAGMENT}
  ${MARKET_FRAGMENT}
  ${OPPONENT_FRAGMENT}
  ${PARTICIPANT_FRAGMENT}
  ${PLAYER_FRAGMENT}
  ${SITUATION_FRAGMENT}
  ${TOURNAMENT_FRAGMENT}
  ${HOLE_FRAGMENT}
`;

const MARKET_QUERY = gql`
  query MarketQuery($gameId: ID!, $marketId: ID!) {
    market(gameId: $gameId, marketId: $marketId) {
      ...MarketFragment
    }
  }
  ${MARKET_FRAGMENT}
`;

const PREDICTIONS_QUERY = gql`
  query PredictionsQuery($page: Int, $meta: Json) {
    predictions(page: $page, meta: $meta) {
      ...PredictionFragment
      opponent {
        ...OpponentFragment
        game {
          league {
            ...LeagueFragment
          }
        }
        participants {
          ...ParticipantFragment
          player {
            ...PlayerFragment
          }
        }
      }
      participant {
        ...ParticipantFragment
        opponent {
          ...OpponentFragment
          game {
            league {
              ...LeagueFragment
            }
          }
        }
        player {
          ...PlayerFragment
        }
      }
      scoreCard {
        ...ScoreCardFragment
        hole {
          ...HoleFragment
        }
        participant {
          ...ParticipantFragment
          player {
            ...PlayerFragment
          }
        }
      }
    }
  }
  ${PREDICTION_FRAGMENT}
  ${OPPONENT_FRAGMENT}
  ${LEAGUE_FRAGMENT}
  ${PARTICIPANT_FRAGMENT}
  ${PLAYER_FRAGMENT}
  ${SCORECARD_FRAGMENT}
  ${HOLE_FRAGMENT}
`;

const SYSTEM_QUERY = gql`
  query SystemQuery {
    system {
      gamesChannel
      pusherAppKey
      pusherCluster
    }
  }
`;

export {
  GAME_QUERY,
  LIGHT_GAMES_QUERY,
  HEAVY_GAMES_QUERY,
  MARKET_QUERY,
  PREDICTIONS_QUERY,
  SYSTEM_QUERY
};

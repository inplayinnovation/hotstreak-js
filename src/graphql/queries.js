import { gql } from 'graphql-request';

import {
  AT_BAT_FRAGMENT,
  DRIVE_FRAGMENT,
  GAME_FRAGMENT,
  HOLE_FRAGMENT,
  IMPLICATION_FRAGMENT,
  LEAGUE_FRAGMENT,
  MARKET_FRAGMENT,
  OPPONENT_FRAGMENT,
  PARTICIPANT_FRAGMENT,
  PLAYER_FRAGMENT,
  PREDICTION_FRAGMENT,
  SCORECARD_FRAGMENT,
  STATISTIC_FRAGMENT,
  TOURNAMENT_FRAGMENT
} from './fragments';

const GAME_QUERY = gql`
  query GameQuery($id: ID!) {
    game(id: $id) {
      ...GameFragment
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
      ... on BaseballGame {
        atBat {
          ...AtBatFragment
        }
        lineup
        pitchCounts
        runners
      }
      ... on FootballGame {
        currentDrive {
          ...DriveFragment
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
  ${AT_BAT_FRAGMENT}
  ${DRIVE_FRAGMENT}
  ${TOURNAMENT_FRAGMENT}
  ${HOLE_FRAGMENT}
`;

const LEAGUE_QUERY = gql`
  query LeagueQuery($id: ID!) {
    league(id: $id) {
      ...LeagueFragment
      games {
        ...GameFragment
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
        ... on BaseballGame {
          atBat {
            ...AtBatFragment
          }
          lineup
          pitchCounts
          runners
        }
        ... on FootballGame {
          currentDrive {
            ...DriveFragment
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
  }
  ${LEAGUE_FRAGMENT}
  ${GAME_FRAGMENT}
  ${MARKET_FRAGMENT}
  ${OPPONENT_FRAGMENT}
  ${PARTICIPANT_FRAGMENT}
  ${PLAYER_FRAGMENT}
  ${AT_BAT_FRAGMENT}
  ${DRIVE_FRAGMENT}
  ${TOURNAMENT_FRAGMENT}
  ${HOLE_FRAGMENT}
`;

const LEAGUES_QUERY = gql`
  query LeaguesQuery {
    leagues {
      ...LeagueFragment
      games {
        ...GameFragment
        opponents {
          ...OpponentFragment
        }
        ... on BaseballGame {
          atBat {
            ...AtBatFragment
          }
          lineup
          pitchCounts
          runners
        }
      }
    }
  }
  ${LEAGUE_FRAGMENT}
  ${GAME_FRAGMENT}
  ${OPPONENT_FRAGMENT}
  ${AT_BAT_FRAGMENT}
`;

const LIGHT_GAMES_QUERY = gql`
  query LightGamesQuery {
    games {
      ...GameFragment
      opponents {
        ...OpponentFragment
      }
      ... on BaseballGame {
        atBat {
          ...AtBatFragment
        }
        lineup
        pitchCounts
        runners
      }
      ... on FootballGame {
        currentDrive {
          ...DriveFragment
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
  ${AT_BAT_FRAGMENT}
  ${DRIVE_FRAGMENT}
  ${TOURNAMENT_FRAGMENT}
  ${HOLE_FRAGMENT}
`;

const HEAVY_GAMES_QUERY = gql`
  query HeavyGamesQuery($status: String) {
    games(status: $status) {
      ...GameFragment
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
      ... on BaseballGame {
        atBat {
          ...AtBatFragment
        }
        lineup
        pitchCounts
        runners
      }
      ... on FootballGame {
        currentDrive {
          ...DriveFragment
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
  ${AT_BAT_FRAGMENT}
  ${DRIVE_FRAGMENT}
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

const PREDICTION_QUERY = gql`
  query PredictionQuery($predictionId: ID!) {
    prediction(predictionId: $predictionId) {
      ...PredictionFragment
      implications {
        ...ImplicationFragment
        statistic {
          ...StatisticFragment
          implications {
            ...ImplicationFragment
          }
        }
      }
    }
  }
  ${PREDICTION_FRAGMENT}
  ${IMPLICATION_FRAGMENT}
  ${STATISTIC_FRAGMENT}
`;

const PREDICTIONS_QUERY = gql`
  query PredictionsQuery($page: Int, $meta: Json) {
    predictions(page: $page, meta: $meta) {
      ...PredictionFragment
      opponent {
        ...OpponentFragment
        participants {
          ...ParticipantFragment
          player {
            ...PlayerFragment
          }
        }
      }
      participant {
        ...ParticipantFragment
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
  LEAGUE_QUERY,
  LEAGUES_QUERY,
  LIGHT_GAMES_QUERY,
  HEAVY_GAMES_QUERY,
  MARKET_QUERY,
  PREDICTION_QUERY,
  PREDICTIONS_QUERY,
  SYSTEM_QUERY
};

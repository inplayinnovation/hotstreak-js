import { gql } from 'graphql-request';

import {
  GAME_FRAGMENT,
  LEAGUE_FRAGMENT,
  MARKET_FRAGMENT,
  OPPONENT_FRAGMENT,
  PARTICIPANT_FRAGMENT,
  PLAYER_FRAGMENT,
  PREDICTION_FRAGMENT,
  SITUATION_FRAGMENT,
  TEAM_FRAGMENT
} from './fragments';

const GAMES_QUERY = gql`
  query GamesQuery {
    games {
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
        team {
          ...TeamFragment
        }
      }
      ... on FootballGame {
        situation {
          ...SituationFragment
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
  ${TEAM_FRAGMENT}
  ${SITUATION_FRAGMENT}
`;

const PREDICTIONS_QUERY = gql`
  query PredictionsQuery($page: Int, $meta: Json) {
    predictions(page: $page, meta: $meta) {
      ...PredictionFragment
      target {
        ... on Participant {
          ...ParticipantFragment
          opponent {
            ...OpponentFragment
            team {
              ...TeamFragment
            }
          }
          player {
            ...PlayerFragment
          }
        }
      }
    }
  }
  ${PREDICTION_FRAGMENT}
  ${PARTICIPANT_FRAGMENT}
  ${OPPONENT_FRAGMENT}
  ${TEAM_FRAGMENT}
  ${PLAYER_FRAGMENT}
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

export { GAMES_QUERY, PREDICTIONS_QUERY, SYSTEM_QUERY };

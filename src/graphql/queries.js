import { gql } from 'graphql-request';

import {
  GAME_FRAGMENT,
  LEAGUE_FRAGMENT,
  MARKET_FRAGMENT,
  OPPONENT_FRAGMENT,
  PARTICIPANT_FRAGMENT,
  PLAYER_FRAGMENT,
  PREDICTION_FRAGMENT,
  TEAM_FRAGMENT
} from './fragments';

const GAMES_QUERY = gql`
  {
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
    }
  }
  ${GAME_FRAGMENT}
  ${LEAGUE_FRAGMENT}
  ${MARKET_FRAGMENT}
  ${OPPONENT_FRAGMENT}
  ${PARTICIPANT_FRAGMENT}
  ${PLAYER_FRAGMENT}
  ${TEAM_FRAGMENT}
`;

const PREDICTIONS_QUERY = gql`
  query PredictionsQuery($page: Int, $meta: Json) {
    predictions(page: $page, meta: $meta) {
      ...PredictionFragment
    }
  }
  ${PREDICTION_FRAGMENT}
`;

const SYSTEM_QUERY = gql`
  {
    system {
      gamesChannel
      pusherAppKey
      pusherCluster
    }
  }
`;

export { GAMES_QUERY, PREDICTIONS_QUERY, SYSTEM_QUERY };

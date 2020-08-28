import { gql } from 'graphql-request';

import {
  GAME_FRAGMENT,
  LEAGUE_FRAGMENT,
  OPPONENT_FRAGMENT,
  PARTICIPANT_FRAGMENT,
  PLAYER_FRAGMENT,
  TEAM_FRAGMENT
} from './fragments';

const GAMES_QUERY = gql`
  {
    games {
      ...GameFragment
      league {
        ...LeagueFragment
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
  ${OPPONENT_FRAGMENT}
  ${PARTICIPANT_FRAGMENT}
  ${PLAYER_FRAGMENT}
  ${TEAM_FRAGMENT}
`;

const SYSTEM_QUERY = gql`
  {
    system {
      pusherAppKey
      pusherCluster
    }
  }
`;

export { GAMES_QUERY, SYSTEM_QUERY };

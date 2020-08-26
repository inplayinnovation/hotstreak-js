import { gql } from 'graphql-request';

const GAMES_QUERY = gql`
  {
    games {
      id
      clock
      elapsed
      league {
        id
        alias
        name
        regulationClock
        regulationPeriods
      }
      opponents {
        id
        designation
        game {
          id
        }
        participants {
          id
          opponent {
            id
          }
          player {
            id
            firstName
            headshotUrl
            lastName
            number
            position
          }
        }
        score
        team {
          id
          market
          name
          shortName
        }
      }
      period
      scheduledAt
      status
    }
  }
`;

export { GAMES_QUERY };

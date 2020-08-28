import { gql } from 'graphql-request';

const GAME_FRAGMENT = gql`
  fragment GameFragment on Game {
    broadcastChannel
    clock
    elapsed
    id
    league {
      id
    }
    opponents {
      id
    }
    period
    replay
    scheduledAt
    status
  }
`;

const LEAGUE_FRAGMENT = gql`
  fragment LeagueFragment on League {
    alias
    broadcastChannel
    id
    name
    regulationClock
    regulationPeriods
  }
`;

const OPPONENT_FRAGMENT = gql`
  fragment OpponentFragment on Opponent {
    designation
    game {
      id
    }
    id
    participants {
      id
    }
    score
    team {
      id
    }
  }
`;

const PARTICIPANT_FRAGMENT = gql`
  fragment ParticipantFragment on Participant {
    id
    opponent {
      id
    }
    player {
      id
    }
  }
`;

const PLAYER_FRAGMENT = gql`
  fragment PlayerFragment on Player {
    firstName
    headshotUrl
    id
    lastName
    number
    position
  }
`;

const TEAM_FRAGMENT = gql`
  fragment TeamFragment on Team {
    id
    market
    name
    shortName
  }
`;

export {
  GAME_FRAGMENT,
  LEAGUE_FRAGMENT,
  OPPONENT_FRAGMENT,
  PARTICIPANT_FRAGMENT,
  PLAYER_FRAGMENT,
  TEAM_FRAGMENT
};

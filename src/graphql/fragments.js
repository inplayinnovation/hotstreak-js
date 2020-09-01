import { gql } from 'graphql-request';

const GAME_FRAGMENT = gql`
  fragment GameFragment on Game {
    __typename
    broadcastChannel
    clock
    elapsed
    event
    id
    league {
      __typename
      id
    }
    opponents {
      __typename
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
    __typename
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
    __typename
    designation
    game {
      __typename
      id
    }
    id
    participants {
      __typename
      id
    }
    score
    team {
      __typename
      id
    }
  }
`;

const PARTICIPANT_FRAGMENT = gql`
  fragment ParticipantFragment on Participant {
    __typename
    id
    opponent {
      __typename
      id
    }
    player {
      __typename
      id
    }
  }
`;

const PLAYER_FRAGMENT = gql`
  fragment PlayerFragment on Player {
    __typename
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
    __typename
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

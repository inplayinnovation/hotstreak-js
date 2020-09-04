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
    markets {
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

const MARKET_FRAGMENT = gql`
  fragment MarketFragment on Market {
    __typename
    affinity
    durations
    id
    lines
    probabilities
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

const PREDICTION_FRAGMENT = gql`
  fragment PredictionFragment on Prediction {
    __typename
    actualOutcome
    beginGameClock
    category
    createdAt
    current
    endGameClock
    id
    line
    meta
    position
    predictedOutcome
    probability
    sequence
    state
    subject
    target {
      __typename
      id
    }
    updatedAt
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
  MARKET_FRAGMENT,
  OPPONENT_FRAGMENT,
  PARTICIPANT_FRAGMENT,
  PREDICTION_FRAGMENT,
  PLAYER_FRAGMENT,
  TEAM_FRAGMENT
};

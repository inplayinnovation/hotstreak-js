import { gql } from 'graphql-request';

const AT_BAT_FRAGMENT = gql`
  fragment AtBatFragment on AtBat {
    __typename
    balls
    createdAt
    hitter {
      __typename
      id
    }
    id
    outs
    pitcher {
      __typename
      id
    }
    strikes
    updatedAt
  }
`;

const EVENT_FRAGMENT = gql`
  fragment EventFragment on Event {
    __typename
    clock
    createdAt
    description
    elapsedGameClock
    id
    period
    updatedAt
    wallClock
  }
`;

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
    scores
    status
  }
`;

const HOLE_FRAGMENT = gql`
  fragment HoleFragment on Hole {
    __typename
    createdAt
    id
    number
    par
    updatedAt
    yardage
  }
`;

const STATISTIC_FRAGMENT = gql`
  fragment StatisticFragment on Statistic {
    __typename
    createdAt
    event {
      ...EventFragment
    }
    id
    participant {
      __typename
      id
    }
    statisticType
    updatedAt
  }
  ${EVENT_FRAGMENT}
`;

const IMPLICATION_FRAGMENT = gql`
  fragment ImplicationFragment on Implication {
    __typename
    category
    createdAt
    delta
    id
    statistic {
      ...StatisticFragment
    }
    updatedAt
  }
  ${STATISTIC_FRAGMENT}
`;

const LEAGUE_FRAGMENT = gql`
  fragment LeagueFragment on League {
    __typename
    alias
    broadcastChannel
    id
    name
    overtimeClock
    overtimePeriods
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

const TEAM_FRAGMENT = gql`
  fragment TeamFragment on Team {
    __typename
    id
    market
    name
    shortName
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
    team {
      ...TeamFragment
    }
  }
  ${TEAM_FRAGMENT}
`;

const PARTICIPANT_FRAGMENT = gql`
  fragment ParticipantFragment on Participant {
    __typename
    id
    opponent {
      __typename
      id
    }
    order
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

const SCORECARD_FRAGMENT = gql`
  fragment ScoreCardFragment on ScoreCard {
    __typename
    createdAt
    hole {
      __typename
      id
    }
    id
    participant {
      __typename
      id
    }
    updatedAt
  }
`;

const SITUATION_FRAGMENT = gql`
  fragment SituationFragment on Situation {
    __typename
    distance
    down
    id
    location {
      __typename
      id
    }
    possession {
      __typename
      id
    }
    yardline
  }
`;

const TOURNAMENT_FRAGMENT = gql`
  fragment TournamentFragment on Tournament {
    __typename
    createdAt
    id
    name
    updatedAt
  }
`;

export {
  AT_BAT_FRAGMENT,
  GAME_FRAGMENT,
  HOLE_FRAGMENT,
  IMPLICATION_FRAGMENT,
  LEAGUE_FRAGMENT,
  MARKET_FRAGMENT,
  OPPONENT_FRAGMENT,
  PARTICIPANT_FRAGMENT,
  PREDICTION_FRAGMENT,
  PLAYER_FRAGMENT,
  SCORECARD_FRAGMENT,
  SITUATION_FRAGMENT,
  TEAM_FRAGMENT,
  TOURNAMENT_FRAGMENT
};

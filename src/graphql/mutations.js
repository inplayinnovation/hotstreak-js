import { gql } from 'graphql-request';

import { PREDICTION_FRAGMENT } from './fragments';

const PREDICT_MUTATION = gql`
  mutation Predict(
    $gameId: ID!
    $marketId: String!
    $predictedOutcome: String!
    $expectedLine: Float
    $expectedProbability: Float
    $expectedDuration: Float
    $meta: Json
  ) {
    predict(
      gameId: $gameId
      marketId: $marketId
      predictedOutcome: $predictedOutcome
      expectedLine: $expectedLine
      expectedProbability: $expectedProbability
      expectedDuration: $expectedDuration
      meta: $meta
    ) {
      prediction {
        ...PredictionFragment
      }
    }
  }
  ${PREDICTION_FRAGMENT}
`;

export { PREDICT_MUTATION };

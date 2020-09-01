import { gql } from 'graphql-request';

const PREDICT_MUTATION = gql`
  mutation Predict($gameId: ID!, $marketId: String!, $predictedOutcome: String!, $expectedLine: Float, $expectedProbability: Float, $expectedDuration: Float) {
    predict(gameId: $gameId, marketId: $marketId, predictedOutcome: $predictedOutcome, expectedLine: $expectedLine, expectedProbability: $expectedProbability, expectedDuration: $expectedDuration) {
      prediction {
        actualOutcome
        beginGameClock
        category
        createdAt
        current
        endGameClock
        id
        line
        position
        predictedOutcome
        probability
        sequence
        state
        updatedAt
      }
    }
  }
`;

export { PREDICT_MUTATION };

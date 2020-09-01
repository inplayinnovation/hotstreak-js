import { gql } from 'graphql-request';

const PREDICT_MUTATION = gql`
  mutation Predict($gameId: ID!, $marketId: String!, $predictedOutcome: String!, $expectedLine: Float, $expectedProbability: Float, $expectedDuration: Float) {
    predict(gameId: $gameId, marketId: $marketId, predictedOutcome: $predictedOutcome, expectedLine: $expectedLine, expectedProbability: $expectedProbability, expectedDuration: $expectedDuration) {
      {
        prediction {
          id
          category
          line
          probability
          predictedOutcome
          actualOutcome
          beginGameClock
          endGameClocxk
        }
      }
    }
  }
`;

export { PREDICT_MUTATION };

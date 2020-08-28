function parsePrediction(prediction) {
  const [affinity, signature] = prediction;
  const [predictionComponents] = signature.split(':');
  const [
    participantId,
    beginClock,
    endClock,
    line,
    overProbability,
    statCategory,
    predictedAt
  ] = predictionComponents.split(',');

  return {
    id: `${participantId}:${statCategory}`,
    affinity,
    beginClock: parseInt(beginClock),
    endClock: parseInt(endClock),
    line: parseFloat(line),
    overProbability: parseFloat(overProbability),
    participant: `Participant:${participantId}`,
    predictedAt: parseFloat(predictedAt),
    signature,
    statCategory
  };
}

export { parsePrediction };

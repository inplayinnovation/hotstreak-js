function parseMarket(market) {
  const [affinity, signature] = market;
  const [marketComponents] = signature.split(':');
  const [
    participantId,
    beginClock,
    endClock,
    line,
    overProbability,
    statCategory,
    predictedAt
  ] = marketComponents.split(',');

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

export { parseMarket };

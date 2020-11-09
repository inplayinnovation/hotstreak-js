function marketIdToJson(marketId) {
  const [targetId, category, position = null] = marketId.split(',');

  let target;
  const targetIdComponents = targetId.split(':');
  const __typename = targetIdComponents[0];
  if (__typename === 'Golf') {
    const [participantId, holeId] = targetIdComponents[3].split('#');
    target = {
      __typename: 'ScoreCard',
      id: targetId,
      hole: {
        __typename: 'Hole',
        id: `Golf::Hole:${holeId}`
      },
      participant: {
        __typename: 'Participant',
        id: `Participant:${participantId}`
      }
    };
  } else {
    target = {
      __typename,
      id: targetId
    };
  }

  const json = { category, target };
  if (position) {
    json.position = position;
  }

  return json;
}

export { marketIdToJson };

function marketIdToJson(marketId) {
  const [targetId, category, position = null] = marketId.split(',');

  let hole = null,
    target;
  const targetIdComponents = targetId.split(':');
  const __typename = targetIdComponents[0];
  if (__typename === 'Golf') {
    const [participantId, holeId] = targetIdComponents[3].split('#');
    hole = {
      __typename: 'Hole',
      id: `Hole:${holeId}`
    };
    target = {
      __typename: 'Participant',
      id: `Participant:${participantId}`
    };
  } else {
    target = {
      __typename,
      id: targetId
    };
  }

  return {
    category,
    hole,
    position,
    target
  };
}

export { marketIdToJson };

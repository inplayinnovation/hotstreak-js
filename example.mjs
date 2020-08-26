import HotStreak from './index.js';

const HAAS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhOTUyNTQ4MmY3YjNmNWM3MzdlYjhiZjA4MzlkMTljZiIsInN1YiI6IlVzZXI6OGxldFBxIiwiZXhwIjoxNTk4NTYwMTE0fQ.aslOPd1N3H2PJp8aif-kqnTeVrB4YzNQf-mHNmRRIJg';

const hotstreak = new HotStreak(HAAS_TOKEN);
hotstreak.subscribe((game, predictions) => {
  console.log(game);
  console.log(predictions);
});

import HotStreak from './index.js';

(async () => {
  const hotstreak = new HotStreak({
    baseUrl: 'https://ft-api-staging.herokuapp.com/',
    key: 'KEY',
    secret: 'SECRET'
  });
  const { games } = await hotstreak.fetchGames();
  hotstreak.subscribeToGame(games[0], entities => {
    console.log(entities);
  });
})();

# HotStreak JavaScript SDK

The HotStreak JavaScript SDK provides convenient access to HotStreak's real-time prediction feeds.

## Installation

Install the package with:

```sh
yarn add hotstreak
# or
npm i hotstreak --save
```

## Usage

To import the package:

```javascript
import HotStreak from 'hotstreak';
// or
const HotStreak = require('hotstreak');
```

HotStreak needs to be configured with your account's public/private keys, and the URL of the environment you want to point to. Contact HotStreak support to get started.

```javascript
const hotstreak = new HotStreak({
  baseUrl: 'BASE_URL',
  key: 'YOUR_KEY',
  secret: 'YOUR_SECRET'
});
```

Subscribing to one game:

```javascript
const games = await hotstreak.fetchGames();
hotstreak.subscribeToChannel(games[0].broadcastChannel, (game, predictions) => {
  console.log(game);
  console.log(predictions);
});
```

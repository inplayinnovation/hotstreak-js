# HotStreak JavaScript SDK

The HotStreak JavaScript SDK provides convenient access to HotStreak's real-time market feeds.

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

HotStreak needs to be initialized with:
  1) The URL of the environment you want to point to as `baseUrl`
  2) Credentials
      * Server (i.e. node) - pass `key` and `secret` directly
      * Client (i.e. browser, mobile device, etc.) - generate a JWT signed with `secret` on server. Then pass the JWT to your client. The JWT payload should contain your API key `{ iss: key, subject: 'optional_client_id', exp: TIMESTAMP_IN_FUTURE }`

🚨🚨🚨 You should NOT deploy your API `secret` to the client directly!

```javascript
// server initialization
const hotstreak = new HotStreak({
  baseUrl: 'BASE_URL',
  key: 'YOUR_KEY',
  secret: 'YOUR_SECRET'
});

// client initialization
const jwt = await getJwtFromYourServer();
const hotstreak = new HotStreak({
  baseUrl: 'BASE_URL',
  token: jwt
});
```

Subscribing to one game:

```javascript
const games = await hotstreak.fetchGames();
hotstreak.subscribeToChannel(games[0].broadcastChannel, (game, markets) => {
  console.log(game);
  console.log(markets);
});
```

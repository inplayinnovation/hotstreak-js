const shell = require('shelljs');
shell.exec('npm version patch');
shell.exec(
  './node_modules/browserify/bin/cmd.js src/hotstreak.js -p esmify --standalone HotStreak  > dist/web.js'
);
shell.exec('git add .');
shell.exec('git commit -m "Made build"');
shell.exec('npm publish');

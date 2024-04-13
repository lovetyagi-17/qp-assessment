import express from 'express';
import path from 'path';
import * as l10n from 'jm-ez-l10n';

import config from './common/config';
import loaders from './common/loaders';
import routes from './api/routes';

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });
  app.use(express.static(path.join(__dirname, 'public')));
  l10n.setTranslationsFile(
    'en',
    __dirname + '/common/language/translation.en.json'
  );

  app.listen(config.PORT, (err?: any) => {
    if (err) {
      console.info(err);
      process.exit(1);
    }
    console.info(`
        ##################################################################
          🛡️  Server listening on port: \x1b[37m\x1b[1m ${config.PORT} \x1b[0m with node version: \x1b[37m\x1b[1m ${process.versions.node} \x1b[0m 🛡️
          ##################################################################
      `);
    return true;
  });
}

startServer();

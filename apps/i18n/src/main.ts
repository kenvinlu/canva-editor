import { config } from './config.service';

import fs from 'fs';
import path from 'path';

try {
  const locale = process.env.NODE_ENV;

  console.log(`Generating ${locale}...`);
  const fileBody = JSON.stringify(config);
  // Copy to the Shared Utils
  const webDir = path.resolve(`apps/canva-web/public/locales/${locale}`);

  if (!fs.existsSync(webDir)) {
    fs.mkdirSync(webDir, { recursive: true });
  }
  fs.writeFileSync(`${webDir}/translations.json`, fileBody);
  console.log(`Generated ${locale} at ${webDir}/translations.json`);
} catch (err) {
  console.log('Something went wrong!');
  console.error(err);
}

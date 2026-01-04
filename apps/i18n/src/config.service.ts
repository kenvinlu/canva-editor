import path from 'path';
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, 'locales');
const config = require('config');

export { config };

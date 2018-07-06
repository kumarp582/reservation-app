// Look in ./config/webpack folder for webpack.dev.js
switch (process.env.NODE_ENV) {
    case 'production':
        module.exports = require('./config/webpack/webpack.bundled')();
        break;
    case 'development':
    default:
        module.exports = require('./config/webpack/webpack.dev')();
}

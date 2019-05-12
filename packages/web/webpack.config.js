const merge = require('webpack-merge');
// This will automatically get the dev/prod config based on process.env.NODE_ENV.
const expoConfig = require('@expo/webpack-config');
const fs = require('fs');
const path = require('path');

const cwd = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(cwd, relativePath)

const jsxLoader = {
  test: /\.js$/,
  include: [resolveApp('./index.js'), resolveApp('./node_modules/@monorepo')],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true
    }
  }
}

// Expo expects a function so we can pass around options.
module.exports = function(env, argv) {
  return merge(expoConfig(env, argv), {
    resolve: {
      alias: {
        'react-native$': 'react-native-web'
      }
    },
    module: {
      rules: [jsxLoader]
    }
  });
};

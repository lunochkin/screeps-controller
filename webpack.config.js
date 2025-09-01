const path = require('path');

module.exports = (env, argv) => {
  const config = {
    entry: './src/engine/main.ts',
    target: 'node',
    mode: argv.mode || 'development',
    devtool: argv.mode === 'development' ? 'source-map' : false,
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      libraryTarget: 'commonjs2',
      clean: true
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: 'ts-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },

    resolve: {
      extensions: ['.ts', '.js', '.json']
    },

    optimization: {
      minimize: argv.mode === 'production'
    }
  };

  return config;
};

const path = require('path');

module.exports = {
  entry: {
    lib: './src/index.ts',
    example: './src/example/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle-[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
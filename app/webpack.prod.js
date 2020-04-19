const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './jsx/app.jsx',
    output: {
        path: __dirname + '/js/',
        filename: 'bundle.js'
    },
    devtool: '#sourcemap',
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // all options are optional
          filename: 'styles.css',
          chunkFilename: 'styles_chunk.css',
          ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Creates `style` nodes from JS strings
                    // 'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }
        ]
    }
}

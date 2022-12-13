const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { VextPackPlugin } = require('vextpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const config = {
    entry: [ './app/index' ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'static/bundle.js',
        hashFunction: 'xxhash64',
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [ 'babel-loader' ],
                exclude: /node_modules/,
                include: __dirname,
            },
            {
                test: /(\.scss|\.css)$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ],
            },
            {
                test: /\.json$/,
                use: [ 'json' ],
            }
        ],
    },
};

module.exports = (env, argv) => {
    config.plugins.push(new HtmlWebpackPlugin({
        title: 'VU',
        template: 'index.html',
        alwaysWriteToDisk: true,
    }));

    if (argv.mode === 'production') {
        config.optimization = {
            nodeEnv: 'production',
            minimize: true,
        };

        config.plugins.push(new CleanWebpackPlugin({
            dry: false,
            cleanOnceBeforeBuildPatterns: [
                '**/*'
            ],
            dangerouslyAllowCleanPatternsOutsideProject: true,
        }));

        config.plugins.push(new CopyPlugin({
            patterns: [
                { from: './assets/', to: './assets/', globOptions: { ignore: [ '**/scss/**' ] } },
            ],
        }));

        config.plugins.push(new VextPackPlugin({
            outputPath: './',
            hotReloadSupport: false,
        }));
    } else {
        config.devServer = {
            hot: true,
            static: {
                directory: path.join(__dirname, 'assets'),
                publicPath: '/assets',
            },
        };

        console.log(config.devServer.static);
        
        config.devtool = 'eval-cheap-module-source-map';

        config.plugins.push(new HtmlWebpackHarddiskPlugin());
        config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return config;
};

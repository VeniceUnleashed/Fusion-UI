const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { VextPackPlugin } = require('vextpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
    entry: ['./app/index'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'static/bundle.js',
        publicPath: '/static/',
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
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [ 'file-loader' ],
            },
            {
                test: /\.json$/,
                use: [ 'json' ],
            }
        ],
    },
};

module.exports = (env, argv) => {
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
                { from: './index.html', to: './index.html' },
            ],
        }));

        config.plugins.push(new VextPackPlugin({
            outputPath: './',
            hotReloadSupport: false,
        }));
    } else {
        config.devServer = {
            hot: true,
        };

        config.devtool = 'cheap-module-eval-source-map';
        config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return config;
};

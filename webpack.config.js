const path = require('path');
const webpack = require('webpack');

const config = {
    entry: ['./app/index'],
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [ 'babel-loader' ],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /(\.scss|\.css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [ 'file-loader' ]
            },
            {
                test: /\.json$/,
                use: [ 'json' ]
            }
        ],
    },
    devServer: {
        hot: true,
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'production') {
        config.optimization = {
            nodeEnv: 'production',
            minimize: true,
        };
    } else {
        config.devtool = 'cheap-module-eval-source-map';
        config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return config;
};

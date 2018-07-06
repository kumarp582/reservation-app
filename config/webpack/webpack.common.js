const webpack = require('webpack');
const helpers = require('../utils/helpers');
const webpackConfig = require('../utils/webpack-config')();
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AssetsPlugin = require('assets-webpack-plugin');
const isDevServer = helpers.isWebpackDevServer();
const environment = helpers.getEnvironment();
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');


// Note: Loaders load from bottom to top and right to left
module.exports = function () {
    var devServerPlugins = isDevServer ? [
        new BundleAnalyzerPlugin({
            openAnalyzer: false
        })
    ]: [];
    return {
        entry: webpackConfig.entryPoints,
        resolve: {
            extensions: ['.jsx', '.js', '.json'],
            modules: [
                helpers.getAbsolutePath('app'),
                helpers.getAbsolutePath('node_modules')
            ]
        },
        output: {
            publicPath: '/'
        },
        context: helpers.getAbsolutePath('ui-app/components'),
        devServer: webpackConfig.devServerConfig,
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components|webfont.config.js)/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.(jpg|png|gif)$/,
                use: 'file-loader'
            }, {
                test: /\.(eot|woff2?|svg|ttf|woff|otf)([\?]?.*)$/,
                use: 'file-loader?name=[name].[ext]'
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader", "sass-loader"],
                    fallback: "style-loader"
                })
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader"],
                    fallback: "style-loader"
                })
            }, {
                test: /\.json$/,
                use: 'json-loader'
            }, {
                test: /webfont\.config\.js/,
                use: [
                    'style-loader',
                    'css-loader',
                    'webfonts-loader'
                ]
            }]
        },
        plugins: [
            new AssetsPlugin({
                path: helpers.getAbsolutePath('public'),
                filename: 'webpack-assets.json',
                prettyPrint: true
            }),
            new CleanWebpackPlugin([
                helpers.getAbsolutePath('public')
            ], {
                root: helpers.getAbsolutePath('')
            }),
            new webpack.DefinePlugin({
                isDevServer,
                // Required for react
                "process.env": {
                    NODE_ENV: JSON.stringify(environment)
                },
                // This will be available in your application code
                appEnvironment:  JSON.stringify(helpers.getFlagByName("env") || "development")
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer'
            }),
            new HtmlWebpackPlugin({
                template: helpers.getAbsolutePath('index.html'),
                filename: 'index.html',
                title: webpackConfig.pageInfo.title,
                chunksSortMode: 'dependency',
                inject: 'body',
                metadata: {
                    baseURL: webpackConfig.pageInfo.baseURL,
                    faviconPath: webpackConfig.pageInfo.faviconPath,
                    isDevServer: isDevServer
                }
            }),
            ...devServerPlugins
        ]
    };
};

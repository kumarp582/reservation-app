const helpers = require('../utils/helpers');
const commonConfig = require('./webpack.common')();
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function () {
    return webpackMerge(commonConfig, {
        devtool: 'cheap-module-source-map',
        output: {
            filename: '[name].bundle.js',
            path: helpers.getAbsolutePath('public'),
            sourceMapFilename: '[file].map',
            chunkFilename: "[id].chunk.js"
        },
        module: {
            rules: []
        },
        plugins: [
            new ExtractTextPlugin('[name].css'),
            new CopyWebpackPlugin([{
                from: helpers.getAbsolutePath('ui-app/tempResources'),
                to: helpers.getAbsolutePath('public/tempResources')
            }])
        ]
    });
};

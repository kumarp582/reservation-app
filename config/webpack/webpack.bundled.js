const helpers = require('../utils/helpers');
const commonConfig = require('./webpack.common')();
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = function () {
    return webpackMerge(commonConfig, {
        devtool: 'nosources-source-map',
        output: {
            path: helpers.getAbsolutePath('public'),
            filename: '[name].bundle.js',
            // filename: '[name].bundle.[hash].js',
            // chunkFilename: '[id].chunk.[hash].js'
        },
        module: {
            rules: []
        },
        plugins: [
            // new ExtractTextPlugin('[name].[contenthash].css'),
            new ExtractTextPlugin('[name].css'),
            new UglifyJsPlugin({
                beautify: false,
                output: {
                    comments: false
                },
                mangle: {
                    screw_ie8: true
                },
                compress: {
                    screw_ie8: true,
                    warnings: false,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                    negate_iife: false
                }
            })
        ]
    });
};

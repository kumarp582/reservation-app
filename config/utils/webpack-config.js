var helpers = require("./helpers");
// Note: Don't change it to self-executing function as it disrupts the editor's suggest mode
module.exports = function () {
    var isDevServer = helpers.isWebpackDevServer();
    var entryPoints = {
            app: helpers.getAbsolutePath("index.js"),
            fonts: helpers.getAbsolutePath("webfont.config.js")
        },
        devServerConfig = {
            host: "127.0.0.1",
            port: 8085,
            compress: true,
            disableHostCheck: true,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
        },
        pageInfo = {
            title: "Hospitality spin",
            faviconPath: "/favicon.ico",
            baseURL: "/"
        };
    var webpackConfig = {
        entryPoints: entryPoints,
        devServerConfig: devServerConfig,
        pageInfo: pageInfo
    };
    return webpackConfig;
};

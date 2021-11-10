const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const WebpackNotifierPlugin = require('webpack-notifier');
const WebpackBar = require('webpackbar');

module.exports = {
    pwa:{
        workboxOptions:{
            skipWaiting: true, // force always reload index.html
            exclude: [
                /\.html$/, // avoid index.html appear in precache-manifest.xxxxxxxxx.js
            ],
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            }),

            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                // test: /\.(js|css|woff|ttf|eot|woff2)$/,
                test: /\.(js|css)$/,
                threshold: 10240,
                minRatio: 0.8,
            }),

            // https://github.com/Turbo87/webpack-notifier
            new WebpackNotifierPlugin({
                excludeWarnings: true,
            }),
            
            // https://github.com/unjs/webpackbar
            new WebpackBar(),
        ],
        externals:{
            // jquery: 'jQuery',
        }
    },
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "~@/scss/var.scss";`
            }
        },
        sourceMap: true
    },
    transpileDependencies: [
        'vuetify'
    ],
}

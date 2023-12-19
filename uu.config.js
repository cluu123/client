const webpack = require('webpack');
// eslint-disable-next-line
const path = require('path');
// const T = require('./localPlugin');
const port = 3737;
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

// const TestPlugins = require('./webPlugin/testPluign');

module.exports = {
    vue: 3,
    webpack: {
        output: {
            publicPath: process.env.NODE_ENV === 'production' ? '/uu/' : '/'
        },
        module: {
            rules: [
            // {
            //     test: /\.vue$/,
            //     use: ['vue-loader', './localLoader']
            // }
            // {   test: /\.js$/,
            //     // include: path.resolve(__dirname, './node_modules/webpack'),
            //     exclude: /node_modules/,
            //     loader: './testLoader.js'
            // }
            ]
        },
        plugins: [
            // new TestPlugins(),
            new webpack.ProvidePlugin({
                process: require.resolve('process/browser')
            }),
            new webpack.DefinePlugin({
                'process.env.port': port,
                '__VUE_OPTIONS_API__': true,
                '__VUE_PROD_DEVTOOLS__': false
            }),
            // new ClearWebpaclInfo(),
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            })
        // new T(port)
        ]
    }
};

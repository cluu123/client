const path = require('path');

module.exports = {
    host: '127.0.0.1',
    port: 9135,
    server: 'http',
    proxy: {
        '/tot': {
            target: 'http://10.19.84.6:6868',
            changeOrigin: true
        },
        '/img': {
            target: 'http://10.19.84.6:6868',
            changeOrigin: true
        },
        '/upload': {
            target: 'http://10.19.84.6:6868',
            changeOrigin: true
        }
    }
};
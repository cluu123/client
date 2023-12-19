const http = require('http');
const execa = require('execa');
const chalk = require('chalk');
let server = null;

module.exports = class T {
    constructor(opt) {
        this.opt = opt;
    }

    apply(compile) {
        compile.hooks.done.tap('t', async () => {
            if (compile.options.mode === 'production') {
                return;
            }
            if (server) {
                server.close();
            }
            server = http.createServer((req, res) => {
                const url = req.url.split('?')[1];
                if (url) {
                    res.writeHead(200, {
                        'content-type': 'application/json;charset=utf-8',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
                    });
                    const data = {
                        code: 0,
                        data: null,
                        message: 'success'
                    };
                    res.write(JSON.stringify(data));
                    res.end();
                }
            });
            server.listen(this.opt, () => {
                // chalk.BackgroundColor
                console.log('local server is running ', chalk.blue(`http://127.0.0.1:${this.opt}`));
            });
        });
    }
};

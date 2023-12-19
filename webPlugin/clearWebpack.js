const fs = require('fs-extra');

module.exports = class ClearWebpaclInfo {
    apply(compile) {
        compile.hooks.environment.tap('a', () => {
            const webpackPath = `${process.cwd()}/node_modules/webpack/lib/logging/Logger.js`;
            let content = fs.readFileSync(webpackPath, 'utf8');
            content = content.replace(/.*LogType.info.*/g, '');
            fs.writeFileSync(webpackPath, content);
        });
    }
};

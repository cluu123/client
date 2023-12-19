module.exports = class TestPlugins {
    apply(compiler) {
        compiler.hooks.done.tap('TestPlugins',
            (stats) => {
                // 打印出打包后的文件信息
                console.log(stats.toJson().time, 2323232);
                console.log(compiler.options.module.rules[14].use);
                process.exit(1)
            }
        );
        // compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
        //     // 在 optimizeModules 钩子中执行操作
        //     compilation.hooks.optimizeModules.tap('MyPlugin', (modules) => {
        //       // 对每个模块执行自定义操作
        //         console.log(modules, 9909090);
        //     });
        // });
    }
}
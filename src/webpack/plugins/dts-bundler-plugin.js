const path = require("path");
const fs = require("fs");
const dts = require('dts-bundle');

class DtsPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        let name = 'module';
        let filename = 'index.d.ts';
        let directory = './';
        if (this.options) {
            if (this.options.name) {
                name = this.options.name;
            }
            if (this.options.filename) {
                filename = this.options.filename;
            }
        }
        if (compiler.options.output) {
            if (compiler.options.output.filename && !this.options.filename) {
                filename = path.parse(compiler.options.output.filename).name;
            }
            if (compiler.options.output.path) {
                directory = compiler.options.output.path;
            }
        }
        compiler.plugin('after-emit', (compilation, callback) => {
            if (compilation.assets) {
                dts.bundle({
                    name: name,
                    baseDir: './',
                    main: `${directory}/${filename}.d.ts`,
                    out: `${directory}/${filename}.d.ts`,
                    outputAsModuleFolder: true
                    // This option sometimes remove node_modules/typescript/lib/*. That's why we do it manually.
                    // removeSource: true
                });
                for (const file in compilation.assets) {
                    if ((/\.d\.ts$/i).test(file)) {
                        if (file === `${filename}.d.ts`) {
                            compilation.assets[file].size = () => fs.statSync(`${directory}/${filename}.d.ts`).size;
                        }
                        else {
                            if (!compiler.options.watch) {
                                delete compilation.assets[file];
                                fs.unlinkSync(`${directory}/${file}`);
                                const fileDir = path.dirname(`${directory}/${file}`);
                                const files = fs.readdirSync(fileDir);
                                if (files.length <= 0) {
                                    fs.rmdirSync(fileDir);
                                }
                            }
                        }
                    }
                }
                callback();
            }
        });
    }
}

module.exports = DtsPlugin;

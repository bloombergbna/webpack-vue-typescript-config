var chalk = require("chalk");
var os = require("os");

module.exports.tsLoaderStack = [
  {
    loader: "babel-loader",
    query: {
      presets: [
        require.resolve('babel-preset-es2015'),
      ],
      plugins: [
        require.resolve('babel-plugin-syntax-dynamic-import'),
      ],
    },
  },
  {
    loader: "ts-loader",
    options: {
      appendTsSuffixTo: ["\.vue$"],
      happyPackMode: true,
    }
  }
]

module.exports.typeCheckErrorFormatter = function clickableFormatter(message, useColors) {
    var colors = new chalk.constructor({ enabled: useColors });
    var messageColor = message.isWarningSeverity() ? colors.bold.yellow : colors.bold.red;
    var fileAndNumberColor = colors.bold.cyan;
    var codeColor = colors.grey;
    return [
        messageColor(message.getSeverity().toUpperCase() + " in ") +
        fileAndNumberColor(message.getFile() + "(" + message.getLine() + "," + message.getCharacter() + ")") +
        messageColor(':'),

        codeColor(message.getFormattedCode() + ': ') + message.getContent()
    ].join(os.EOL);
};

const path = require("path");
module.exports = {
  lintOnSave: "warning",
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        path.resolve(__dirname, "src/assets/style/variable.less"),
        path.resolve(__dirname, "src/assets/style/mixin.less")
      ]
    }
  },
  outputDir: "server/dist",
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 在 dist/index.html 的输出
      filename: "index.html"
    }
  }
};

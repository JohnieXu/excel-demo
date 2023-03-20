const path = require("path"); //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}
module.exports = {
  configureWebpack: {
    devtool: process.env.NODE_ENV === "production" ? "false" : "source-map",
    externals: {}
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://10.8.11.19:8090/xxx-interface",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/"
        },
        logLevel: "debug"
      }
    },
    port: 3000
  },
  chainWebpack: config => {
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => Object.assign(options, { limit: 8000 }));
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("Components", resolve("./src/components"))
      .set("Assets", resolve("./src/assets"))
      .set("Api", resolve("./src/apis"))
      .set("Utils", resolve("./src/utils"))
      .set("Mixin", resolve("./src/mixin"))
      .set("Store", resolve("./src/store"));
  },
  publicPath: "./"
};

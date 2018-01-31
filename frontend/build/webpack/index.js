const
  path = require('path')
  ,WebpackCompiler = require('./compiler')
  ,WebpackDevServer = require('./dev-server')
  ,config = {
    isProductionBuild: process.env.NODE_ENV === 'production',
    frontendPath: `${path.resolve('./frontend')}/`,
    host: '127.0.0.1',
    port: 8080,
  }
;
let
  webpackCompiler = WebpackCompiler(config)
;
if(config.isProductionBuild) {
  webpackCompiler.run((error, doneData) => {
    if(error) {
      console.log('процесс Webpack был завершен с ошибкой:', error);
    } else {
      console.log('процесс Webpack был успешно завершен:', doneData);
    }
  });
} else {
  WebpackDevServer(config, webpackCompiler)
}

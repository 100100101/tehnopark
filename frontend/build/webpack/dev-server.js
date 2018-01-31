const
  webpackDevServer = require('webpack-dev-server')
;
module.exports = function(config, compiler) {
  return new webpackDevServer(compiler, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  	/*
  	--no-colors: Не использовать цвета в выводе.
  	--hot: Добавляет HotModuleReplacementPluginи переключить сервер в горячем режиме . Примечание: убедитесь , что вы не добавляете в HotModuleReplacementPluginдва раза.
  	--hot --inline также добавляет webpack/hot/dev-server запись.
  	--public: Переопределяет хост и порт , используемый в --inline режиме для клиента (полезно для VM или Докер).
  	--https: Служит WebPack-DEV-сервер по HTTPS протоколу. Включает в себя самостоятельно подписанный сертификат , который используется при обслуживании запросов.
  	--cert, --cacert, --key: Дорожки файлов сертификатов.
  	--open: Открывает URL в браузере по умолчанию (для WebPack-DEV-серверных версий> 2.0).
  	*/
  	/*<file/directory/url/port>: базовый путь для контента.*/
  	contentBase: /*global.CONFIG.paths.frontend.public*/`${config.frontendPath}public/`,
    /**/
  	// publicPath: webpackConfig.output.publicPath,
  	/*ничего не выводить в консоль*/
  	// quiet: false,
  	/*подавить скучную информацию*/
  	// noInfo: true,
  	/*использовать сжатие GZIP*/
  	// compress: true,
  	/*<hostname/ip>: имя хоста или IP. связывается со всеми узлами.0.0.0.0*/
  	// host:,
  	/*<number>: порт*/
  	// port:,
  	/*встраивать webpack-dev-server выполнение в пачку*/
  	// inline:,
  	/*не смотреть, не компилирует по запросу (не может быть объединено с --hot)*/
  	// lazy: true,
  	/*обеспечивает поддержку истории API запасной вариант*/
  	// historyApiFallback: true,
  	/*don't finish the grunt task. Use this in combination with the watch option*/
  	// keepalive: true,
  	/*управляет лог сообщений консоли , показанные в браузере. Используйте error, warning, info или none*/
  	clientLogLevel: 'info',
  	/**/
  	stats: {
  		/*добавить некоторые цвета вывода*/
  		colors: true,
  		// chunks: false,
  		// hash: false,
  		// version: false,
  		// timings: false,
  		// assets: false,
  		// chunks: false,
  		// chunkModules: false
  		// modules: false,
  		// reasons: false,
  		// children: false,
  		// source: false,
  		// errors: false,
  		// errorDetails: false,
  		// warnings: false,
  		// publicPath: false
  	},
  	hot: true,
  	/*embed the webpack-dev-server runtime into the bundle. Defaults to false*/
  	inline: true,
  	/*don't finish the grunt task. Use this in combination with the watch option*/
  	// keepalive: true,
  	// historyApiFallback: true,
  	// quiet: false,
  	// lazy: true,
  	/**/
  	watchOptions: {
      aggregateTimeout: 10,
      poll: 100
    },
  })
  /*инициирование сервера*/
  .listen(config.port, config.host, err => {
  	if(err) {
      console.error('Webpack-dev-server потерпел неудачу при запуске. Причина:', err);
  		return;
  	}
    console.log(`Webpack-dev-server успешно запущен на ${config.host}:${config.port}`);
  });
};

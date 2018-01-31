const
  path = require('path')
  /**/
  ,webpack = require('webpack')
  /**/
  ,webpackDevServer = require('webpack-dev-server')
  /**/
  ,HTMLWebpackPlugin = require('html-webpack-plugin')
  /**/
  ,ExtractTextPlugin = require('extract-text-webpack-plugin')
  /**/
  ,WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  /**/
  ,HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
  /**/
  // ,HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
  /**/
  ,UglifyJsPlugin = require('uglifyjs-webpack-plugin')
;
let
  isProductionBuild = process.env.NODE_ENV === 'production'
  ,frontendPath = `${path.resolve('./frontend')}/`
  ,host = '127.0.0.1'
  ,port = 8080
;
let
  compiler = webpack({
    // devtool: 'eval',
    //  devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',
    // devtool: 'cheap-module-eval-source-map',

    entry: {
      bundle: [
        `${frontendPath}source/`,
      ].concat(isProductionBuild ? [

      ] : [
        `webpack-dev-server/client?http://${host}:${port}/`,
        'webpack/hot/dev-server',
      ]),
    },
    /**/
    output: {
      path: `${frontendPath}public/`,
      filename: '[name].js',
      // library: 'deepstream',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    /**/
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.common.js',
        /**/
        // 'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
      },
      /*разрешить вебпаку пробовать открыть индексный файл с расширением из списка, если он не указан явно в import/require*/
      extensions: [
        '.js',
        '.vue',
        '.css',
      ],
    },
    /**/
    module: {
      rules: [
        /* JS LOADER */
        {
          test: /\.js$/,
          // exclude: /node_modules/,
          use: [
            'babel-loader',
          ],
        },
        /**/
        {
          test: /\.s[a|c]ss$/,
          loader: 'style-loader!css-loader!sass-loader',
        },

        /*VUE LOADER*/
        {
          test: /\.vue$/,
          // exclude: /node_modules/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                /**/
                esModule: false,
                /*при установке в false пробельные символы между HTML тегами в шаблонах будут проигнорированы*/
                preserveWhitespace: false,
                /**/
                extract: /*global.CONFIG.assembly.for === 'production'*/false,

                extractCSS: true,
                /*Во время компиляции шаблона, компилятор может преобразовывать определённые атрибуты, такие как src в ссылках, в вызовы require, таким образом чтобы файл обрабатывался с помощью Webpack. Конфигурация по умолчанию преобразует src атрибуты внутри тегов <img>.*/
                // transformToRequire: {
                // 	img: 'src',
                // },
                /*При установке в false пробельные символы между HTML тегами в шаблонах будут проигнорированы.*/
                // preserveWhitespace: ,
                /*Использование source maps для CSS. Отключение этой опции может позволить избежать некоторых багов с относительными путями в css-loader и сделать сборку немного быстрее.
                Обратите внимание, эта опция автоматически устанавливается в false при отсутствии опции devtool в файле конфигурации Webpack.*/
                // cssSourceMap: ,
                /*примечание: не вкладывайте опции `postcss` внутри `loaders`
                Тип: Array или Function или Object*/
                // postcss: [require('postcss-cssnext')()],
                // postcss: (webpack) => {
                // 	return webpack.options.postcss;
                // },
                /*Эта опция также может быть объектом, который содержит настройки для PostCSS. Это пригодится в проектах с PostCSS, где используются собственные парсеры/сериализаторы:*/
                // postcss: {
                //   plugins: [...], // список плагинов
                //   options: {
                //     parser: sugarss // использование парсера sugarss
                //   }
                // },
                /*
                  preLoaders
                  postLoaders
                  Тип: { [lang: string]: string }
                  Значения lang по умолчанию:
                  <template>: html
                  <script>: js
                  <style>: css
                  // 	<style lang="sass?outputStyle=expanded">
                */
                loaders: {
                  /**/
                  js: 'babel-loader',

                  /**/
                  css: /*ExtractTextPluginPostCSS*/'css-loader',

                  /**/
                  // scss: ExtractTextPlugin.extract({
                  //   /*это внутренняя часть vue-loader, поэтому нет необходимости его устанавливать через NPM*/
                  //   // fallback: 'vue-style-loader',
                  //   fallback: 'style-loader',
                  //   use: [
                  //     'css-loader',
                  //     'sass-loader',
                  //   ],
                  // }),
                  scss: 'style-loader!css-loader!sass-loader',

                  /*extract all <docs> content as raw text*/
                  // 'docs': ExtractTextPlugin.extract('raw-loader'),
                },
                /*
                  `postLoaders` are attached after the default loaders.
                  - For `html`, the result returned by the default loader
                  will be compiled JavaScript render function code.
                  - For `css`, the result will be returned by vue-style-loader
                  which isn't particularly useful in most cases. Using a postcss
                  plugin will be a better option.
                */
                postLoaders: {
                  html: 'babel-loader',
                },
              }
            },
          ],
        },

        /*IMAGE LOADER*/
    		{
    			test: /\.(jpe?g|png|gif|svg)$/i,
    			use: [
    				{
    					loader:'file-loader',
    					options: {
    						/*относительный путь ~ './' позволяет загрузить файл по протоколу 'file:///' без необходимости запускать сервер*/
    						publicPath: '/',
    						// publicPath: '/',
    						outputPath: 'images/',
    						/*дополнительные переменные: [name], ...*/
    						name: '[ext]/[hash].[ext]',
    					},
    				},
    			]
    		},

    		/* FONT LOADER */ /*svg|*/
    		{
    			test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
    			use: [
    				{
    					loader: 'file-loader',
    					options: {
    						publicPath: '/',
    						// publicPath: '/',
    						outputPath: 'fonts/',
    						name: '[name]/[name].[ext]',
    					},
    				}
    			],
    		},

      ],
    },

    /*PLUGINS*/
    plugins: [

      /**/
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),

      /**/
      new webpack.ProvidePlugin({
        fs: 'fs',
        path: 'path',
      }),

      /**/
      new HTMLWebpackPlugin({
        alwaysWriteToDisk: true,
        // inlineSource: '.(js|css)$',
        /**/
        template: `${frontendPath}source/index.html`,
        filename: `${frontendPath}public/index.html`,
        /**/
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          caseSensitive: true,
          // removeAttributeQuotes: true,
          // processScripts: [ 'text/ng-template' ],
        },
      }),

      /**/
      new WebpackBundleAnalyzer({
        analyzerMode: 'static',
        openAnalyzer: false,
      }),

    ].concat(isProductionBuild ? [
      // new HtmlWebpackInlineSourcePlugin(),
      /*new HtmlWebpackHarddiskPlugin() - принудительно записывать в NVRAM HTML-файл, служащий точкой входа для браузера*/
      new HtmlWebpackHarddiskPlugin(),
      /**/
      /*экстрагировать из всего кода CSS стили и поместить в один файл*/
      // new ExtractTextPlugin({
      //   // filename: 'css/[name].bundle.css',
      //   filename: '[name].min.css',
      //   allChunks: true,
      //   /*disables the plugin*/
      //   disable: /*global.CONFIG.assembly.for === 'development'*/false,
      // }),
      /**/
      /**/
      new UglifyJsPlugin(),
    ] : [
      /*для hot-reload`а*/
      new webpack.HotModuleReplacementPlugin(),

    ]),

    node: {
      __filename: true,
      __dirname: true,
      fs: 'empty',
    },

  })
  /**/
  // .run((error, doneData) => {
  //   if(error) {
  //     console.log('процесс Webpack был завершен с ошибкой:', error);
  //   } else {
  //     console.log('процесс Webpack был успешно завершен:', doneData);
  //   }
  // })
;

module.exports = new webpackDevServer(compiler, {
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
	contentBase: /*global.CONFIG.paths.frontend.public*/`${frontendPath}public/`,
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
.listen(port, host, err => {
	if(err) {
    console.error('Webpack-dev-server потерпел неудачу при запуске. Причина:', err);
		return;
	}
  console.log(`Webpack-dev-server успешно запущен на ${host}:${port}`);
});

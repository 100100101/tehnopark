const
  path = require('path')
  /**/
  ,webpack = require('webpack')
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
  /**/
  ,WebpackClearConsole = require("webpack-clear-console").WebpackClearConsole
;
module.exports = function(config) {
  return webpack({
    // devtool: 'eval',
    //  devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',
    // devtool: 'cheap-module-eval-source-map',

    entry: {
      bundle: [
        `${config.frontendPath}source/`,
      ].concat(config.isProductionBuild ? [

      ] : [
        `webpack-dev-server/client?http://${config.host}:${config.port}/`,
        'webpack/hot/dev-server',
      ]),
    },
    /**/
    output: {
      path: `${config.frontendPath}public/`,
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
    						publicPath: './',
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
    						publicPath: './',
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
        template: `${config.frontendPath}source/index.html`,
        filename: `${config.frontendPath}public/index.html`,
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

    ].concat(config.isProductionBuild ? [
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
      // new WebpackClearConsole(),
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

  });
};

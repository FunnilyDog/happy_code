export default {
  target: [
    'web',
    'browserslist:last 1 chrome version,last 1 firefox version,last 1 safari version'
  ],
  name: 'web',
  devtool: 'cheap-module-source-map',
  context: '/Users/dengxin/notes/happy-code',
  mode: 'development',
  infrastructureLogging: {
    level: 'error'
  },
  watchOptions: {
    ignored: /[\\/](?:\.git|node_modules)[\\/]/,
    aggregateTimeout: 0
  },
  experiments: {
    asyncWebAssembly: true
  },
  output: {
    devtoolModuleFilenameTemplate: function () { /* omitted long function */ },
    path: '/Users/dengxin/notes/happy-code/dist',
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/async/[name].js',
    publicPath: '/',
    pathinfo: false,
    hashFunction: 'xxhash64',
    assetModuleFilename: 'static/assets/[name].[contenthash:8][ext]',
    webassemblyModuleFilename: 'static/wasm/[hash].module.wasm'
  },
  resolve: {
    tsConfig: {
      configFile: '/Users/dengxin/notes/happy-code/tsconfig.json',
      references: 'auto'
    },
    alias: {
      '@swc/helpers': '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@swc+helpers@0.5.15/node_modules/@swc/helpers',
      'react-refresh': '/Users/dengxin/notes/happy-code/node_modules/.pnpm/react-refresh@0.16.0/node_modules/react-refresh'
    },
    extensionAlias: {
      '.js': [
        '.js',
        '.ts',
        '.tsx'
      ],
      '.jsx': [
        '.jsx',
        '.tsx'
      ]
    },
    extensions: [
      '.ts',
      '.tsx',
      '.mjs',
      '.js',
      '.jsx',
      '.json'
    ]
  },
  module: {
    parser: {
      javascript: {
        exportsPresence: 'error'
      }
    },
    rules: [
      /* config.module.rule('mjs') */
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        type: 'javascript/auto',
        dependency: {
          not: 'url'
        },
        sideEffects: true,
        use: [
          /* config.module.rule('css').use('mini-css-extract') */
          {
            loader: '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@rspack+core@1.2.3_@swc+helpers@0.5.15/node_modules/@rspack/core/dist/cssExtractLoader.js'
          },
          /* config.module.rule('css').use('css') */
          {
            loader: '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@rsbuild+core@1.2.8/node_modules/@rsbuild/core/compiled/css-loader/index.js',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                namedExport: false,
                exportGlobals: false,
                exportLocalsConvention: 'camelCase',
                localIdentName: '[path][name]__[local]-[hash:base64:6]'
              },
              sourceMap: false
            }
          },
          /* config.module.rule('css').use('lightningcss') */
          {
            loader: 'builtin:lightningcss-loader',
            options: {
              targets: [
                'last 1 chrome version',
                'last 1 firefox version',
                'last 1 safari version'
              ]
            }
          }
        ],
        resolve: {
          preferRelative: true
        }
      },
      /* config.module.rule('js') */
      {
        test: /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/,
        type: 'javascript/auto',
        dependency: {
          not: 'url'
        },
        include: [
          {
            and: [
              '/Users/dengxin/notes/happy-code',
              {
                not: /[\\/]node_modules[\\/]/
              }
            ]
          },
          /\.(?:ts|tsx|jsx|mts|cts)$/,
          /[\\/]@rsbuild[\\/]core[\\/]dist[\\/]/
        ],
        use: [
          /* config.module.rule('js').use('swc') */
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                externalHelpers: true,
                parser: {
                  tsx: true,
                  syntax: 'typescript',
                  decorators: true
                },
                experimental: {
                  cacheRoot: '/Users/dengxin/notes/happy-code/node_modules/.cache/.swc',
                  keepImportAttributes: true
                },
                transform: {
                  legacyDecorator: false,
                  decoratorVersion: '2022-03',
                  react: {
                    development: true,
                    refresh: true,
                    runtime: 'automatic'
                  }
                }
              },
              isModule: 'unknown',
              env: {
                targets: [
                  'last 1 chrome version',
                  'last 1 firefox version',
                  'last 1 safari version'
                ],
                mode: undefined
              }
            }
          }
        ]
      },
      /* config.module.rule('babel-js') */
      {
        test: /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/,
        include: [
          /\.(?:jsx|tsx)$/
        ],
        use: [
          /* config.module.rule('babel-js').use('babel') */
          {
            loader: '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@rsbuild+plugin-babel@1.0.3_@rsbuild+core@1.2.8/node_modules/@rsbuild/plugin-babel/compiled/babel-loader/index.js',
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              plugins: [
                [
                  'babel-plugin-react-compiler',
                  {
                    target: '18'
                  }
                ],
                [
                  '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@babel+plugin-proposal-decorators@7.25.9_@babel+core@7.26.7/node_modules/@babel/plugin-proposal-decorators/lib/index.js',
                  {
                    version: '2022-03'
                  }
                ]
              ],
              presets: [
                [
                  '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@babel+preset-typescript@7.26.0_@babel+core@7.26.7/node_modules/@babel/preset-typescript/lib/index.js',
                  {
                    allowNamespaces: true,
                    allExtensions: true,
                    allowDeclareFields: true,
                    optimizeConstEnums: true,
                    isTSX: true
                  }
                ]
              ]
            }
          }
        ]
      },
      /* config.module.rule('js-data-uri') */
      {
        mimetype: {
          or: [
            'text/javascript',
            'application/javascript'
          ]
        },
        use: [
          /* config.module.rule('js-data-uri').use('swc') */
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                externalHelpers: true,
                parser: {
                  tsx: true,
                  syntax: 'typescript',
                  decorators: true
                },
                experimental: {
                  cacheRoot: '/Users/dengxin/notes/happy-code/node_modules/.cache/.swc',
                  keepImportAttributes: true
                },
                transform: {
                  legacyDecorator: false,
                  decoratorVersion: '2022-03',
                  react: {
                    development: true,
                    refresh: true,
                    runtime: 'automatic'
                  }
                }
              },
              isModule: 'unknown',
              env: {
                targets: [
                  'last 1 chrome version',
                  'last 1 firefox version',
                  'last 1 safari version'
                ],
                mode: undefined
              }
            }
          }
        ],
        resolve: {
          fullySpecified: false
        }
      },
      /* config.module.rule('image') */
      {
        test: /\.(?:png|jpg|jpeg|pjpeg|pjp|gif|bmp|webp|ico|apng|avif|tif|tiff|jfif|cur)$/i,
        oneOf: [
          /* config.module.rule('image').oneOf('image-asset-url') */
          {
            type: 'asset/resource',
            resourceQuery: /(__inline=false|url)/,
            generator: {
              filename: 'static/image/[name].[contenthash:8][ext]'
            }
          },
          /* config.module.rule('image').oneOf('image-asset-inline') */
          {
            type: 'asset/inline',
            resourceQuery: /inline/
          },
          /* config.module.rule('image').oneOf('image-asset') */
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 4096
              }
            },
            generator: {
              filename: 'static/image/[name].[contenthash:8][ext]'
            }
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.svg$/i,
        oneOf: [
          /* config.module.rule('svg').oneOf('svg-asset-url') */
          {
            type: 'asset/resource',
            resourceQuery: /(__inline=false|url)/,
            generator: {
              filename: 'static/svg/[name].[contenthash:8].svg'
            }
          },
          /* config.module.rule('svg').oneOf('svg-asset-inline') */
          {
            type: 'asset/inline',
            resourceQuery: /inline/
          },
          /* config.module.rule('svg').oneOf('svg-asset') */
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 4096
              }
            },
            generator: {
              filename: 'static/svg/[name].[contenthash:8].svg'
            }
          }
        ]
      },
      /* config.module.rule('media') */
      {
        test: /\.(?:mp4|webm|ogg|mov|mp3|wav|flac|aac|m4a|opus)$/i,
        oneOf: [
          /* config.module.rule('media').oneOf('media-asset-url') */
          {
            type: 'asset/resource',
            resourceQuery: /(__inline=false|url)/,
            generator: {
              filename: 'static/media/[name].[contenthash:8][ext]'
            }
          },
          /* config.module.rule('media').oneOf('media-asset-inline') */
          {
            type: 'asset/inline',
            resourceQuery: /inline/
          },
          /* config.module.rule('media').oneOf('media-asset') */
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 4096
              }
            },
            generator: {
              filename: 'static/media/[name].[contenthash:8][ext]'
            }
          }
        ]
      },
      /* config.module.rule('font') */
      {
        test: /\.(?:woff|woff2|eot|ttf|otf|ttc)$/i,
        oneOf: [
          /* config.module.rule('font').oneOf('font-asset-url') */
          {
            type: 'asset/resource',
            resourceQuery: /(__inline=false|url)/,
            generator: {
              filename: 'static/font/[name].[contenthash:8][ext]'
            }
          },
          /* config.module.rule('font').oneOf('font-asset-inline') */
          {
            type: 'asset/inline',
            resourceQuery: /inline/
          },
          /* config.module.rule('font').oneOf('font-asset') */
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 4096
              }
            },
            generator: {
              filename: 'static/font/[name].[contenthash:8][ext]'
            }
          }
        ]
      },
      /* config.module.rule('wasm') */
      {
        test: /\.wasm$/,
        dependency: 'url',
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/[hash].module.wasm'
        }
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        sideEffects: true,
        use: [
          /* config.module.rule('less').use('mini-css-extract') */
          {
            loader: '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@rspack+core@1.2.3_@swc+helpers@0.5.15/node_modules/@rspack/core/dist/cssExtractLoader.js'
          },
          /* config.module.rule('less').use('css') */
          {
            loader: '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@rsbuild+core@1.2.8/node_modules/@rsbuild/core/compiled/css-loader/index.js',
            options: {
              importLoaders: 2,
              modules: {
                auto: true,
                namedExport: false,
                exportGlobals: false,
                exportLocalsConvention: 'camelCase',
                localIdentName: '[path][name]__[local]-[hash:base64:6]'
              },
              sourceMap: false
            }
          },
          /* config.module.rule('less').use('lightningcss') */
          {
            loader: 'builtin:lightningcss-loader',
            options: {
              targets: [
                'last 1 chrome version',
                'last 1 firefox version',
                'last 1 safari version'
              ]
            }
          },
          /* config.module.rule('less').use('less') */
          {
            loader: '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@rsbuild+plugin-less@1.1.0_@rsbuild+core@1.2.8/node_modules/@rsbuild/plugin-less/compiled/less-loader/index.js',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                paths: [
                  '/Users/dengxin/notes/happy-code/node_modules'
                ]
              },
              sourceMap: false,
              implementation: '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@rsbuild+plugin-less@1.1.0_@rsbuild+core@1.2.8/node_modules/@rsbuild/plugin-less/compiled/less/index.js'
            }
          }
        ],
        resolve: {
          preferRelative: true
        }
      }
    ]
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          name: 'lib-react',
          test: /node_modules[\\/](?:react|react-dom|scheduler|react-refresh|@rspack[\\/]plugin-react-refresh)[\\/]/,
          priority: 0
        },
        router: {
          name: 'lib-router',
          test: /node_modules[\\/](?:react-router|react-router-dom|history|@remix-run[\\/]router)[\\/]/,
          priority: 0
        },
        'lib-axios': {
          test: /node_modules[\\/]axios(-.+)?[\\/]/,
          priority: 0,
          name: 'lib-axios'
        }
      }
    }
  },
  plugins: [
    /* config.plugin('RsbuildCorePlugin') */
    {},
    /* config.plugin('hmr') */
    new HotModuleReplacementPlugin(),
    /* config.plugin('mini-css-extract') */
    new CssExtractRspackPlugin(
      {
        filename: 'static/css/[name].css',
        chunkFilename: 'static/css/async/[name].css',
        ignoreOrder: true
      }
    ),
    /* config.plugin('html-index') */
    new HtmlRspackPlugin(
      {
        meta: {
          charset: {
            charset: 'UTF-8'
          },
          viewport: 'width=device-width, initial-scale=1.0'
        },
        chunks: [
          'index'
        ],
        inject: 'head',
        filename: 'index.html',
        entryName: 'index',
        templateParameters: function () { /* omitted long function */ },
        scriptLoading: 'defer',
        title: 'Rsbuild App',
        template: '',
        templateContent: '<!doctype html><html><head></head><body><div id="root"></div></body></html>'
      }
    ),
    /* config.plugin('rsbuild-html-plugin') */
    new RsbuildHtmlPlugin(
      {
        index: {
          templateContent: '<!doctype html><html><head></head><body><div id="root"></div></body></html>'
        }
      },
      ()=>environment,
      function () { /* omitted long function */ }
    ),
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'import.meta.env.MODE': '"development"',
        'import.meta.env.DEV': true,
        'import.meta.env.PROD': false,
        'import.meta.env.BASE_URL': '"/"',
        'import.meta.env.ASSET_PREFIX': '""',
        'process.env.BASE_URL': '"/"',
        'process.env.ASSET_PREFIX': '""'
      }
    ),
    /* config.plugin('react-fast-refresh') */
    new ReactRefreshRspackPlugin(
      {
        include: [
          /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/
        ],
        exclude: [
          /[\\/]node_modules[\\/]/
        ],
        forceEnable: false,
        overlay: false
      }
    )
  ],
  performance: {
    hints: false
  },
  entry: {
    index: [
      '/Users/dengxin/notes/happy-code/src/index.tsx'
    ]
  }
}
export default {
  tools: {
    swc: {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true
        },
        transform: {
          react: {
            development: true,
            refresh: true,
            runtime: 'automatic'
          }
        }
      }
    },
    cssExtract: {
      loaderOptions: {},
      pluginOptions: {
        ignoreOrder: true
      }
    }
  },
  html: {
    meta: {
      charset: {
        charset: 'UTF-8'
      },
      viewport: 'width=device-width, initial-scale=1.0'
    },
    title: 'Rsbuild App',
    inject: 'head',
    mountId: 'root',
    crossorigin: false,
    outputStructure: 'flat',
    scriptLoading: 'defer'
  },
  resolve: {
    alias: {
      '@swc/helpers': '/Users/dengxin/notes/happy-code/node_modules/.pnpm/@swc+helpers@0.5.15/node_modules/@swc/helpers'
    },
    aliasStrategy: 'prefer-tsconfig',
    extensions: [
      '.ts',
      '.tsx',
      '.mjs',
      '.js',
      '.jsx',
      '.json'
    ]
  },
  source: {
    alias: {},
    define: {},
    preEntry: [],
    decorators: {
      version: '2022-03'
    },
    tsconfigPath: '/Users/dengxin/notes/happy-code/tsconfig.json',
    entry: {
      index: '/Users/dengxin/notes/happy-code/src/index.tsx'
    }
  },
  output: {
    target: 'web',
    cleanDistPath: 'auto',
    distPath: {
      root: 'dist',
      css: 'static/css',
      svg: 'static/svg',
      font: 'static/font',
      html: './',
      wasm: 'static/wasm',
      image: 'static/image',
      media: 'static/media',
      assets: 'static/assets',
      js: 'static/js'
    },
    assetPrefix: '/',
    filename: {},
    charset: 'utf8',
    polyfill: 'off',
    dataUriLimit: {
      svg: 4096,
      font: 4096,
      image: 4096,
      media: 4096,
      assets: 4096
    },
    legalComments: 'linked',
    injectStyles: false,
    minify: true,
    manifest: false,
    sourceMap: {
      js: undefined,
      css: false
    },
    filenameHash: true,
    inlineScripts: false,
    inlineStyles: false,
    cssModules: {
      auto: true,
      namedExport: false,
      exportGlobals: false,
      exportLocalsConvention: 'camelCase'
    },
    emitAssets: true
  },
  security: {
    nonce: '',
    sri: {
      enable: false
    }
  },
  performance: {
    profile: false,
    printFileSize: true,
    removeConsole: false,
    removeMomentLocale: false,
    chunkSplit: {
      strategy: 'split-by-experience'
    }
  },
  mode: 'development',
  plugins: [
    {
      name: 'rsbuild:basic',
      setup() {}
    },
    {
      name: 'rsbuild:entry',
      setup() {}
    },
    {
      name: 'rsbuild:cache',
      setup() {}
    },
    {
      name: 'rsbuild:target',
      setup() {}
    },
    {
      name: 'rsbuild:output',
      setup() {}
    },
    {
      name: 'rsbuild:resolve',
      setup() {}
    },
    {
      name: 'rsbuild:file-size',
      setup() {}
    },
    {
      name: 'rsbuild:clean-output',
      setup() {}
    },
    {
      name: 'rsbuild:asset',
      setup() {}
    },
    {
      name: 'rsbuild:html',
      setup() {}
    },
    {
      name: 'rsbuild:app-icon',
      setup() {}
    },
    {
      name: 'rsbuild:wasm',
      setup() {}
    },
    {
      name: 'rsbuild:moment',
      setup() {}
    },
    {
      name: 'rsbuild:node-addons',
      setup() {}
    },
    {
      name: 'rsbuild:define',
      setup() {}
    },
    {
      name: 'rsbuild:css',
      setup() {}
    },
    {
      name: 'rsbuild:minimize',
      setup() {}
    },
    {
      name: 'rsbuild:progress',
      setup() {}
    },
    {
      name: 'rsbuild:swc',
      setup() {}
    },
    {
      name: 'rsbuild:externals',
      setup() {}
    },
    {
      name: 'rsbuild:split-chunks',
      setup() {}
    },
    {
      name: 'rsbuild:inline-chunk',
      setup() {}
    },
    {
      name: 'rsbuild:rsdoctor',
      setup() {}
    },
    {
      name: 'rsbuild:resource-hints',
      setup() {}
    },
    {
      name: 'rsbuild:performance',
      setup() {}
    },
    {
      name: 'rsbuild:bundle-analyzer',
      setup() {}
    },
    {
      name: 'rsbuild:server',
      setup() {}
    },
    {
      name: 'rsbuild:manifest',
      setup() {}
    },
    {
      name: 'rsbuild:module-federation',
      setup() {}
    },
    {
      name: 'rsbuild:rspack-profile',
      setup() {}
    },
    {
      name: 'rsbuild:lazy-compilation',
      setup() {}
    },
    {
      name: 'rsbuild:sri',
      setup() {}
    },
    {
      name: 'rsbuild:nonce',
      setup() {}
    },
    {
      name: 'rsbuild:react',
      setup() {}
    },
    {
      name: 'rsbuild:less',
      setup() {}
    },
    {
      name: 'rsbuild:babel',
      setup() {}
    }
  ],
  _privateMeta: {
    configFilePath: '/Users/dengxin/notes/happy-code/rsbuild.config.ts'
  },
  root: '/Users/dengxin/notes/happy-code',
  dev: {
    hmr: true,
    assetPrefix: '/',
    writeToDisk: false,
    liveReload: true,
    cliShortcuts: true,
    client: {
      path: '/rsbuild-hmr',
      port: '',
      host: '',
      overlay: true,
      reconnect: 100
    }
  },
  server: {
    port: 3001,
    host: '0.0.0.0',
    open: false,
    base: '/',
    htmlFallback: 'index',
    compress: true,
    printUrls: true,
    strictPort: false,
    cors: false
  }
}
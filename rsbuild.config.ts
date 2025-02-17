import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginBabel } from "@rsbuild/plugin-babel";

const ReactCompilerConfig = {
  target: "18"
};

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginLess(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift([
          "babel-plugin-react-compiler",
          ReactCompilerConfig
        ]);
      }
    })
  ],
  server: {
    port: 3001
  }
});

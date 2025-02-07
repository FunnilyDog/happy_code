module.exports = function (api) {
  api.cache(true);

  return {
    plugins: [
      [
        "babel-plugin-react-compiler",
        {
          target: "18"
        }
      ]
      // [
      //   "import",
      //   {
      //     libraryName: "antd",
      //     libraryDirectory: "es",
      //     style: "css"
      //   },
      //   "antd"
      // ],
      // [
      //   "import",
      //   {
      //     libraryName: "@formily/antd",
      //     libraryDirectory: "esm",
      //     style: true
      //   },
      //   "@formily/antd"
      // ]
    ]
  };
};

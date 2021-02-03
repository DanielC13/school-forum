const CracolessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracolessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // '@primary-color': '#949400'
              "@text-color": "#3c4043",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

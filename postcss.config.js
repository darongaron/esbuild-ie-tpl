module.exports = (ctx) => ({
  //parser: 'sugarss',
  map: { inline: false },
  plugins: {
    //require('postcss-import')({}),
    'postcss-import':{},
    'postcss-preset-env': {
      preserve: false,
      stage: 2,
      autoprefixer: { grid: "autoplace" },
    },
    //require('cssnano')({}),
    'cssnano': ctx.env === 'production' ? {} : false,
  },
});

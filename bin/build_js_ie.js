const babel = require('@babel/core');
const esbuild = require('esbuild');
const fs = require('fs').promises;
const from_filename = "./dist/app.js";
const to_filename = "./dist/app-ie.js";

const options = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
        //"modules": false
      }
    ]
  ],
  //"plugins": [
  //  [
  //    "@babel/plugin-transform-runtime",
  //    {
  //      //"corejs": 3
  //    }
  //  ]
  //]
};

(async (from_filename, to_filename) => {
  try {
    //let js = await fs.readFile(filename, 'utf-8');
    let js = await babel.transformFileAsync(from_filename, options);
    await fs.writeFile('dist/app-babel1.js', js.code);
    await esbuild.build({
      entryPoints: ['dist/app-babel1.js'],
      outfile: 'dist/app-esbuild1.js',
      bundle: true,
      //write: false,
    });
    js = await babel.transformFileAsync('dist/app-esbuild1.js', {});
    //js.code = await esbuild.transform(js.code, {loader: 'js'}).js;
    //await fs.writeFile('dist/app-esbuild1.js', js.code);
    await fs.writeFile(to_filename, js.code);
    
  } catch (error) {
    //console.error(error.message);
    console.error(error.toString());
  }

})(from_filename, to_filename);

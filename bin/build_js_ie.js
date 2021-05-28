const babel = require('@babel/core');
const fs = require('fs').promises;
const esbuild = require('esbuild');
const infile =  process.env.npm_package_config_infile
const outfile = process.env.npm_package_config_outfile_ie
const is_debug = process.env.npm_package_config_debug === 'true';

(async () => {
  try {
    console.log('start esbuild1 ts -> js (ts build & bundle)');
    let result = await esbuild.build({
      entryPoints: [infile],
      sourcemap: 'inline',
      bundle: true,
      write: false,
    });
    if(is_debug){
      console.debug(Object.keys(result));
      fs.writeFile('dist/app-esbuild1.js', result.outputFiles[0].contents);
    }

    console.log('start babel1 js -> ie_js (import polyfill & transform)');
    result = await babel.transformAsync((new TextDecoder).decode(result.outputFiles[0].contents), {
      sourceMaps: "inline",
      comments: false,
      "presets": [["@babel/preset-env", {}]],
      "plugins": [["@babel/plugin-transform-runtime",{"corejs": 3}]
      ]
    });
    if(is_debug){
      console.debug(Object.keys(result));
      fs.writeFile('dist/app-babel1.js', result.code);
    }

    console.log('start esbuild2 ie_js -> bundle_js (bundle polyfill)');
    result = await esbuild.build({
      sourcemap: 'inline',
      bundle: true,
      write: false,
      stdin: {
        contents: result.code,
        resolveDir: require('path').join(__dirname),
      }
    });
    if(is_debug){
      console.debug(Object.keys(result));
      fs.writeFile('dist/app-esbuild2.js', result.outputFiles[0].contents);
    }

    console.log('start babel2 bundle_js -> bundle_ie_js (transform)');
    result = await babel.transformAsync((new TextDecoder).decode(result.outputFiles[0].contents), {
      sourceMaps: "inline",
      "presets": [["@babel/preset-env", {}]],
    });
    if(is_debug){
      console.debug(Object.keys(result));
      fs.writeFile('dist/app-babel2.js', result.code);
    }    

    console.log('start esbuild3 , output files (minify)');
    result = await esbuild.build({
      outfile: outfile,
      sourcemap: true,
      minifyWhitespace: true,
      minifyIdentifiers: true,
      stdin: {
        contents: result.code,
      }
    });
  } catch (error) {
    console.error(error.toString());
  }
})();


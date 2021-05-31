const babel = require('@babel/core');
const fs = require('fs').promises;
const esbuild = require('esbuild');
const outdir = process.env.npm_package_config_outdir;
const outbase = process.env.npm_package_config_outbase;
const is_debug = process.env.npm_package_config_debug === 'true';

const ieBuild = async (infile, outfile) => {
  try {
    console.log(`${infile} start esbuild1 ts -> js (ts build & bundle)`);
    let result = await esbuild.build({
      entryPoints: [infile],
      //entryPoints: entry_points,
      sourcemap: 'inline',
      bundle: true,
      write: false,
    });
    if(is_debug){
      console.debug(Object.keys(result));
      fs.writeFile(`${outfile}-esbuild1.js`, result.outputFiles[0].contents);
    }

    console.log(`${infile} start babel1 js -> ie_js (import polyfill & transform)`);
    result = await babel.transformAsync((new TextDecoder).decode(result.outputFiles[0].contents), {
      sourceMaps: "inline",
      comments: false,
      "presets": [["@babel/preset-env", {}]],
      "plugins": [["@babel/plugin-transform-runtime",{"corejs": 3}]
      ]
    });
    if(is_debug){
      console.debug(Object.keys(result));
      fs.writeFile(`${outfile}-babel1.js`, result.code);
    }

    console.log(`${infile} start esbuild2 ie_js -> bundle_js (bundle polyfill)`);
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
      fs.writeFile(`${outfile}-esbuild2.js`, result.outputFiles[0].contents);
    }

    console.log(`${infile} start babel2 bundle_js -> bundle_ie_js (transform)`);
    result = await babel.transformAsync((new TextDecoder).decode(result.outputFiles[0].contents), {
      sourceMaps: "inline",
      "presets": [["@babel/preset-env", {}]],
    });
    if(is_debug){
      console.debug(Object.keys(result));
      fs.writeFile(`${outfile}-babel2.js`, result.code);
    }    

    console.log(`${infile} start esbuild3 , output files (minify) ${outfile}`);
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
};

for(const property in process.env){
  if(property.indexOf('npm_package_config_entry_points') !== -1){
    const infile = process.env[property];
    let outfile = process.env[property].replace(new RegExp('^' + outbase,'i'), outdir);
    outfile = outfile.replace(/\.tsx|\.ts|\.jsx|\.js$/i, '-ie.js');
    if (is_debug) console.debug('infile', `infile: ${infile} outfile: ${outfile}`);
    ieBuild(infile, outfile);
  }
}


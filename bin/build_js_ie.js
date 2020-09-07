const babel = require('@babel/core');
//const esbuild = require('esbuild');
const fs = require('fs').promises;
const from_filename = "src/ts/app.ts";
//const from_sourcemap_filename = "dist/app.js.map";
const to_filename = "dist/app-ie.js";

(async (from_filename, to_filename) => {
  const { startService } = require('esbuild');
  const service = await startService();
  try {
    console.log('start esbuild1 ts -> js');
    let result = await service.build({
      entryPoints: [from_filename],
      sourcemap: 'inline',
      bundle: true,
      write: false,
    });
    fs.writeFile('dist/app-esbuild1.txt', result);
    fs.writeFile('dist/app-esbuild1.js', result.outputFiles[0].contents);

    console.log('start babel1 js -> ie_js');
    result = await babel.transformAsync((new TextDecoder).decode(result.outputFiles[0].contents), {
      sourceMaps: "inline",
      comments: false,
      "presets": [["@babel/preset-env", {}]],
      "plugins": [["@babel/plugin-transform-runtime",{"corejs": 3}]
      ]
    });
    fs.writeFile('dist/app-babel1.txt', result);
    fs.writeFile('dist/app-babel1.js', result.code);

    console.log('start esbuild2 ie_js -> bundle_js');
    result = await service.build({
      sourcemap: 'inline',
      bundle: true,
      write: false,
      stdin: {
        contents: result.code,
      }
    });
    fs.writeFile('dist/app-esbuild2.txt', result);
    fs.writeFile('dist/app-esbuild2.js', result.outputFiles[0].contents);

    console.log('start babel2 bundle_js -> bundle_ie_js');
    result = await babel.transformAsync((new TextDecoder).decode(result.outputFiles[0].contents), {
      sourceMaps: "inline",
    });
    fs.writeFile('dist/app-babel2.txt', result);
    fs.writeFile('dist/app-babel2.js', result.code);

    console.log('start esbuild3 minify, output files');
    result = await service.build({
      outfile: to_filename,
      sourcemap: true,
      minify: true,
      stdin: {
        contents: result.code,
      }
    });
  } catch (error) {
    console.error(error.toString());
  }
  finally {
    service.stop();
  }
})(from_filename, to_filename);


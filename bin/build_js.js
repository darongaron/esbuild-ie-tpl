const { build, serve } = require('esbuild');
const infile =  process.env.npm_package_config_infile;
const outfile = process.env.npm_package_config_outfile;
const servedir = process.env.npm_package_config_servedir;
const port = parseInt(process.env.npm_package_config_serveport || 8000);
const is_debug = process.env.npm_package_config_debug === 'true';
const is_serve = process.env.serve === 'true';
const is_watch = process.env.watch === 'true';
const is_minify = process.env.minify === 'true';

const build_options = {
  entryPoints: [infile],
  sourcemap: true,
  bundle: true,
  outfile: outfile,
}

if (is_minify) build_options.minify = true;
if (is_watch) build_options.watch = true;

if (is_debug) {
  console.debug('build_options:');
  console.debug(build_options);
}

if(is_serve){
  serve({ port: port, servedir: servedir },build_options);
} else {
  build(build_options);
}

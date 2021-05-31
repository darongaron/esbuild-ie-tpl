const { build, serve } = require('esbuild');
const entry_points = [];
const outdir = process.env.npm_package_config_outdir;
const outbase = process.env.npm_package_config_outbase;
const servedir = process.env.npm_package_config_servedir;
const port = parseInt(process.env.npm_package_config_serveport || 8000);
const is_debug = process.env.npm_package_config_debug === 'true';
const is_serve = process.env.serve === 'true';
const is_watch = process.env.watch === 'true';
const is_minify = process.env.minify === 'true';

for(const property in process.env){
  if(property.indexOf('npm_package_config_entry_points') !== -1){
    entry_points.push(process.env[property]);
  }
}

const build_options = {
  entryPoints: entry_points,
  sourcemap: true,
  bundle: true,
  outdir:outdir,
  outbase,outbase
}

if (is_minify) build_options.minify = true;
if (is_watch) build_options.watch = true;

if (is_debug) {
  console.debug('entry_points:');
  console.debug(entry_points);
  console.debug('build_options:');
  console.debug(build_options);
}

if(is_serve){
  serve(
    { port: port, servedir: servedir },
    build_options
  ).then(server => {console.debug(`start server ${server.host}:${server.port}`)});
} else {
  build(build_options);
}

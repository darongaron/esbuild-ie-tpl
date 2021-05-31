# Esbuild setting example for Internet Explorer 11 

## features

* Build fast (Webpack & Babel are slow)
* Installation is fast (Webpack is slow)
  * Less dependent
* Development: Esbuild only
* Release: Esbuild and Babel(preset-env, core-js) only
* Works on windows 

## Work in IE11

* TypeScript and JSX syntax by Esbuild
* ES6 and CommonJS modules by Esbuild
* Classes by Babel preset-env
* async await by core-js
* And many more.

## How to install

```
npm install
```

## Usage

Run a Local server(watch & build). Need to reload.
```
npm start
```

watch & build(dependent)
```
npm watch
```

Release build(build for ie & minify)
```
npm run release
```

Show usage
```
npm run
```

### Config
package.json
```
...
  "config": {
    "debug": "false",
    "entry_points": ["src/ts/app.ts", "src/js/app.js"],
    "outdir": "dist",
    "outbase": "src",
    "servedir": ".",
    "serveport": "8000"
  },
...
```
index.html
```
    if (is_ie) {
      ele_script_ts.src = "dist/ts/app-ie.js";
      ele_script_js.src = "dist/js/app-ie.js";
    } else {
      ele_script_ts.src = "dist/ts/app.js";
      ele_script_js.src = "dist/js/app.js";
    }
```

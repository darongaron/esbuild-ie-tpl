const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const precss = require('precss');
const fs = require('fs');

fs.readFile('src/app.css', (err, css) => {
  postcss([precss, autoprefixer])
    .process(css, { from: 'src/app.css', to: 'dest/app.css' })
    .then(result => {
      fs.writeFile('dest/app.css', result.css, () => true)
      if ( result.map ) {
        fs.writeFile('dest/app.css.map', result.map, () => true)
      }
    })
})

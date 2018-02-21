require('fs').readdirSync(__dirname).forEach((file) => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    let fileName = file.replace('.js', '');
    fileName = file.charAt(0).toUpperCase() + fileName.slice(1);
    exports[fileName] = require(`${__dirname}/${file}`);
  }
});

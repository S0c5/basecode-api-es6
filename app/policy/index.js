require('fs').readdirSync(__dirname).forEach((file) => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    let fileName = file.replace('.js', ''),
      module = require(`${__dirname}/${file}`);

    if (typeof module === 'object') {
      Object
        .keys(module)
        .map((_k) => {
          exports[_k] = module[_k];
        });
    } else {
      exports[fileName] = module;
    }
  }
});

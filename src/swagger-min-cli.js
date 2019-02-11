#!/usr/bin/env node

axios      = require('axios');
fs         = require('fs');
program    = require('commander');
pkg        = require('../package.json');
yaml       = require('js-yaml');
swagger    = require('./swagger-min');

program
  .version(pkg.version)
  .option('-f, --file [path|url]',   '[required] The path to the swagger document. Can be local or remote.')
  .option('-v, --verb [verb]',   '[required] The verb that should be hit')
  .option('-r, --route [route]', '[required] The route')

program.parse(process.argv);

if (!program.file || !program.verb || !program.route) {
  program.help();
}

function print(obj) {
  if (!obj) {
    console.log('Could not find the specified operation');
    return;
  }
  console.log(yaml.safeDump(obj));
}

try {
  if (program.file.startsWith('http')) {
    axios.get(program.file)
      .then(function (response) {
        var text = JSON.stringify(response.data);
        var obj = swagger.minify(text, program.verb, program.route);
        print(obj);
      })
      .catch(function (response) {
        console.log(response.message);
      });
  }
  else {
    text = fs.readFileSync(program.file, 'utf8');
    var obj = swagger.minify(text, program.verb, program.route);
    print(obj);
  }
}
catch (e) {
  console.log(e);
}

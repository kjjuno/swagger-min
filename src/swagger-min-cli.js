#!/usr/bin/env node

program    = require('commander');
pkg        = require('../package.json');
yaml       = require('js-yaml');
swagger    = require('./swagger-min');

program
  .version(pkg.version)
  .option('-f, --file [path]',   '[required] The path to the swagger document')
  .option('-v, --verb [verb]',   '[required] The verb that should be hit')
  .option('-r, --route [route]', '[required] The route')

program.parse(process.argv);

if (!program.file || !program.verb || !program.route) {
  program.help();
}

try {
  var obj = swagger.minify(program.file, program.verb, program.route);
  if (!obj) {
    console.log('Could not find the specified operation');
    return;
  }
  console.log(yaml.safeDump(obj));
} catch (e) {
  console.log(e);
}

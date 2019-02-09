#!/usr/bin/env node

program = require('commander');
yaml    = require('js-yaml');
fs      = require('fs');
pkg     = require('./package.json');

program
  .version(pkg.version)
  .option('-f, --file [path]',   '[required] The path to the swagger document')
  .option('-v, --verb [verb]',   '[required] The verb that should be hit')
  .option('-r, --route [route]', '[required] The route')

program.parse(process.argv);

if (!program.file || !program.verb || !program.route) {
  program.help();
}

function isObject(a) {
  return (!!a) && (a.constructor === Object);
}

function getRefs(doc, path, verb) {
  var operation = doc.paths[path][verb];

  return getObjectRefs(operation);
}

function getObjectRefs(obj) {
  var refs = [];
  if (isObject(obj)) {
    for (var propertyName in obj) {
      if (propertyName === '$ref') {
        refs.push(obj[propertyName]);
      }
      var moreRefs = getObjectRefs(obj[propertyName]);
      for (var i = 0; i < moreRefs.length; i++) {
        refs.push(moreRefs[i]);
      }
    }
  }
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      var moreRefs = getObjectRefs(obj[i]);
      for (var j = 0; j < moreRefs.length; j++) {
        refs.push(moreRefs[j]);
      }
    }
  }
  return refs;
}

function appendRefs(obj, doc, refs) {
  for (var i = 0; i < refs.length; i++) {
    var ref = refs[i];
    var parts = ref.split('/');
    var docObj = doc;
    var curr = obj;
    for (var j = 1; j < parts.length; j++) {
      var section = parts[j];
      curr[section] = curr[section] || {};
      docObj = docObj[section];

      if (j < parts.length - 1) {
        curr = curr[section];
      }
    }
    curr[section] = docObj;

    var childRefs = getObjectRefs(docObj);
    appendRefs(obj, doc, childRefs);
  }
}

try {
  var doc = yaml.safeLoad(fs.readFileSync(program.file, 'utf8'));
  if (!doc.paths[program.route] || !doc.paths[program.route][program.verb]) {
    console.log('Could not find the specified operation');
    return;
  }
  var operation = doc.paths[program.route][program.verb];
  var obj = {
    'paths': {}
  };
  obj.paths[program.route] = {};
  obj.paths[program.route][program.verb] = operation;

  var refs = getRefs(doc, program.route, program.verb);
  appendRefs(obj, doc, refs);
  console.log(yaml.safeDump(obj));
} catch (e) {
  console.log(e);
}

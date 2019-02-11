yaml = require('js-yaml');
fs   = require('fs');

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

function minify(file, verb, route) {
  var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  if (!doc.paths[route] || !doc.paths[route][verb]) {
    return null;
  }
  var operation = doc.paths[route][verb];
  var obj = {
    'paths': {}
  };
  obj.paths[route] = {};
  obj.paths[route][verb] = operation;

  var refs = getRefs(doc, route, verb);
  appendRefs(obj, doc, refs);

  return obj;
}

module.exports.minify = minify;

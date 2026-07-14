function fill(data) {
  var filled = 0;
  if (typeof fillFields !== 'undefined') {
    filled = fillFields(data);
  } else if (typeof require !== 'undefined') {
    var formFiller = require('../lib/formFiller');
    filled = formFiller.fillFields(data);
  }
  return { filled: filled, total: 5 };
}

var name = 'Generic';

function matches(url) {
  return true;
}

if (typeof window !== 'undefined') {
  window.genericFill = fill;
  window.genericName = name;
  window.genericMatches = matches;
}
if (typeof module !== 'undefined') {
  module.exports = { fill: fill, name: name, matches: matches };
}

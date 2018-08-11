import { TinyColor } from './index';

// This line tells TypeScript about the ES2015 default export
export default TinyColor;

// This line provides the export for both node and
// the ES2015 default export. So both of these will work:
//  node: `var TinyColor = require('./public_api');`
//  ts: `import TinyColor from './public_api';
if (typeof module !== "undefined") {
  module.exports = TinyColor;
  module.exports.default = TinyColor;
}

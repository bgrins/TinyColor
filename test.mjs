
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js is a CommonJS module.
const tinycolor = require('./tinycolor');


test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});
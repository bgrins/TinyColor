var TinyColor = require('../src/public_api');

describe('TinyColor', () => {
  it('should init from node require', () => {
    const r = new TinyColor('red');
    expect(r).toBeInstanceOf(TinyColor);
    expect(r.toName()).toBe('red');
    expect(r).toBeTruthy();
  });
});

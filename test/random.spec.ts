import { TinyColor } from '../src';
import { random } from '../src/random';

describe('random', () => {
  it('should accept count', () => {
    expect(random({ count: 10 }).length).toBe(10);
  });
  it('should accept hue', () => {
    let colors = random({ hue: 'purple', count: 3, seed: 11100 }).map(n => n.toHexString());
    expect(colors).toEqual(['#9b22e6', '#9f1ceb', '#a316f0']);
    colors = random({ hue: 'red', count: 3, seed: 13371337 }).map(n => n.toHexString());
    expect(colors).toEqual(['#e34236', '#e34230', '#e8432a']);
    colors = random({ hue: 'blue', count: 3, seed: 13371337 }).map(n => n.toHexString());
    expect(colors).toEqual(['#3346d6', '#2e39d9', '#2828de']);
    colors = random({ hue: 'purple', count: 3, seed: 13371337 }).map(n => n.toHexString());
    expect(colors).toEqual(['#9335db', '#952fde', '#9929e3']);
    colors = random({ hue: 'orange', count: 3, seed: 13371337 }).map(n => n.toHexString());
    expect(colors).toEqual(['#e8a438', '#ebaa31', '#edac2b']);
    colors = random({ hue: 'pink', count: 3, seed: 13371337 }).map(n => n.toHexString());
    expect(colors).toEqual(['#f03ab9', '#f032b1', '#f22ca9']);
    colors = random({ hue: '#E6E6FA', count: 3, seed: 420420 }).map(n => n.toHexString());
    expect(colors).toEqual(['#4141d1', '#3939d4', '#3333d6']);
    colors = random({ hue: 999, count: 3, seed: 420420 }).map(n => n.toHexString());
    expect(colors).toEqual(['#4167d1', '#393cd4', '#5733d6']);
    colors = random({ hue: 'monochrome', count: 3, seed: 420420 }).map(n => n.toHexString());
    expect(colors).toEqual(['#9e9e9e', '#a8a8a8', '#b3b3b3']);
    colors = random({ hue: NaN, count: 3, seed: 420420 }).map(n => n.toHexString());
    expect(colors).toEqual(['#4167d1', '#393cd4', '#5733d6']);
  });
  it('should accept luminosity', () => {
    let colors = random({ luminosity: 'bright', count: 3, seed: 11100 }).map(n =>
      n.toHexString(),
    );
    expect(colors).toEqual(['#d916f2', '#f511da', '#f70ca5']);
    colors = random({ luminosity: 'dark', count: 3, seed: 9999923 }).map(n => n.toHexString());
    expect(colors).toEqual(['#06377a', '#05197d', '#0d0580']);
  });
  it('should accept luminosity', () => {
    let colors = random({ luminosity: 'bright', count: 3, seed: 11100 }).map(n =>
      n.toHexString(),
    );
    expect(colors).toEqual(['#d916f2', '#f511da', '#f70ca5']);
    colors = random({ luminosity: 'dark', count: 3, seed: 9999923 }).map(n => n.toHexString());
    expect(colors).toEqual(['#06377a', '#05197d', '#0d0580']);
    colors = random({ luminosity: 'light', count: 3, seed: 9999923 }).map(n => n.toHexString());
    expect(colors).toEqual(['#91baf2', '#8e9ff5', '#938cf5']);
    colors = random({ luminosity: 'bright', count: 3, seed: 9999923 }).map(n =>
      n.toHexString(),
    );
    expect(colors).toEqual(['#2568c4', '#223ec9', '#2b1fcf']);
    colors = random({ luminosity: 'random', count: 3, seed: 9999923 }).map(n =>
      n.toHexString(),
    );
    expect(colors).toEqual(['#3e6396', '#3b4ca1', '#4038ab']);
  });
  it('should accept hue and luminosity', () => {
    let colors = random({ hue: 'red', luminosity: 'bright', count: 3, seed: 13378008 }).map(n =>
      n.toHexString(),
    );
    expect(colors).toEqual(['#db2a21', '#de2d1d', '#e33119']);
    colors = random({ hue: 'red', luminosity: 'dark', count: 3, seed: 13378008 }).map(n =>
      n.toHexString(),
    );
    expect(colors).toEqual(['#a60f07', '#a61205', '#a81805']);
  });
  it('should accept alpha', () => {
    const colors = random({ alpha: 0.4, seed: 13378008 });
    expect(colors.a).toBe(0.4);
  });
});

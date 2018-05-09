import uglify from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: './demo/src/main.ts',
	output: {
		file: './demo/public/bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
    typescript({
      tsconfig: './demo/tsconfig.json',
    }),
		production && uglify() // minify, but only in production
	]
};

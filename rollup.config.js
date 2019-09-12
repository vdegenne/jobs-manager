import resolve from 'rollup-plugin-node-resolve'

export default {
  input: './app.js',
  output: { file: 'bundle.js', format: 'iife' },
  plugins: [resolve()]
}

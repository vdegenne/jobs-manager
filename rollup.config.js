import resolve from 'rollup-plugin-node-resolve'
// import cleanup from 'rollup-plugin-cleanup'
import typescript from 'rollup-plugin-typescript'

export default {
  input: './src/app.ts',
  output: { file: './dist/app.js', format: 'iife' },
  plugins: [resolve(), typescript() /*cleanup({ comments: 'none' })*/]
}

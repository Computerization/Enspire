import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  vue: true,
  ignores: ['components/ui/'],
  unocss: true,
}, {
  rules: {
    'node/prefer-global/process': 'off',
  },
})

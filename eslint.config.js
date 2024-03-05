import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  ignores: ['components/ui/'],
}, {
  rules: {
    'node/prefer-global/process': 'off',
  },
})

import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['components/ui/'],
}, {
  rules: {
    'node/prefer-global/process': 'off',
  },
})

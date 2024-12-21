import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default antfu({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  vue: true,
  ignores: ['components/ui/'],
  unocss: true,
  ...pluginQuery.configs['flat/recommended'],
}, {
  rules: {
    'node/prefer-global/process': 'off',
  },
})

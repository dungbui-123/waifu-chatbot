import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.config({
    plugins: ['prettier', 'react', 'react-hooks', 'import', 'unused-imports'],
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'prettier',
      'plugin:prettier/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/typescript',
      'plugin:import/recommended',
      'plugin:import/errors'
    ],
    rules: {
      'prettier/prettier': 'warn'
    }
  })
]

export default eslintConfig

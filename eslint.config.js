import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['.nuxt/**', '.output/**', 'dist/**', 'node_modules/**', '*.min.js', 'coverage/**'],
  },

  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        $fetch: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        withDefaults: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        $fetch: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        withDefaults: 'readonly',
      },
    },
    plugins: {
      vue,
    },
    rules: {
      ...js.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/no-unused-components': 'warn',
      'vue/require-prop-types': 'off',
      'vue/require-default-prop': 'off',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
]

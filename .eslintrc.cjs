require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  // Игнорируем скомпилированные файлы и node_modules
  ignorePatterns: ['dist/**', 'node_modules/**'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    extraFileExtensions: ['.vue']
  },
  rules: {
    // Vue правила
    'vue/multi-word-component-names': 'off', // Разрешаем однословные имена компонентов
    'vue/html-indent': ['error', 2], // Отступ 2 пробела в шаблонах
    'vue/singleline-html-element-content-newline': 'off', // Отключаем переносы для однострочных элементов
    'vue/max-attributes-per-line': 'off', // Отключаем ограничение атрибутов на строку
    'vue/component-tags-order': [
      'error',
      {
        // Порядок тегов в компонентах
        order: ['script', 'template', 'style']
      }
    ],

    // Базовые правила
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': 'off', // Отключаем в пользу TS версии

    // TypeScript правила
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_', // Игнорировать переменные, начинающиеся с _
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/no-explicit-any': 'warn', // Предупреждение для any
    '@typescript-eslint/ban-ts-comment': 'warn', // Предупреждение для @ts-ignore

    // Prettier интеграция
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        printWidth: 100,
        trailingComma: 'none',
        htmlWhitespaceSensitivity: 'ignore',
        vueIndentScriptAndStyle: true,
        endOfLine: 'auto'
      }
    ]
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: true,
            types: {
              '{}': false // Разрешаем пустые объекты
            }
          }
        ]
      }
    },
    {
      files: ['*.vue'],
      rules: {
        'vue/block-order': [
          'error',
          {
            // Порядок блоков в .vue файлах
            order: ['script', 'template', 'style']
          }
        ]
      }
    }
  ],
  settings: {
    'import/resolver': {
      typescript: {} // Для корректной работы с путями TypeScript
    }
  }
}

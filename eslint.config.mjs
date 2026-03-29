// @ts-check
import eslint from '@eslint/js';
import sheriff from '@softarc/eslint-plugin-sheriff';
import vitest from '@vitest/eslint-plugin';
import angular from 'angular-eslint';
import { importX } from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import rxjsX from 'eslint-plugin-rxjs-x';
import testingLibrary from 'eslint-plugin-testing-library';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/', '.angular/', 'coverage/', 'node_modules/']),

  // TypeScript files (components, directives, pipes, services, etc.)
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      sheriff.configs.all,
      importX.flatConfigs.recommended,
      rxjsX.configs.recommended,
      prettierRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      'unused-imports': unusedImports,
      perfectionist,
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'tp', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'tp', style: 'kebab-case' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'import-x/no-unresolved': 'off',
      'import-x/named': 'off',
      'import-x/namespace': 'off',
      'import-x/order': 'off',
      'perfectionist/sort-imports': [
        'error',
        { type: 'natural', internalPattern: ['^@/.*', '^\\..*'] },
      ],
      'perfectionist/sort-named-imports': ['error', { type: 'natural' }],
      'perfectionist/sort-named-exports': ['error', { type: 'natural' }],
      'perfectionist/sort-enums': ['error', { type: 'natural' }],
      'perfectionist/sort-interfaces': ['error', { type: 'natural' }],
      'perfectionist/sort-union-types': ['error', { type: 'natural' }],
      'perfectionist/sort-intersection-types': ['error', { type: 'natural' }],
      'perfectionist/sort-switch-case': ['error', { type: 'natural' }],
    },
  },

  // HTML templates
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettierRecommended,
    ],
    rules: {},
  },

  // Vitest test files
  {
    files: ['**/*.spec.ts'],
    extends: [testingLibrary.configs['flat/angular']],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/prefer-to-be': 'warn',
      'vitest/prefer-to-contain': 'warn',
      'vitest/prefer-to-have-length': 'warn',
      'vitest/no-duplicate-hooks': 'error',
      'vitest/prefer-hooks-on-top': 'error',
      'vitest/prefer-hooks-in-order': 'error',
      'vitest/max-nested-describe': ['error', { max: 3 }],
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
);

import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default defineConfig([
    globalIgnores(['node_modules', 'dist', '.wrangler']),
    ...compat.extends('alloy'),
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.worker,
                // Cloudflare Workers globals
                addEventListener: 'readonly',
                env: 'readonly',
                Cookies: 'readonly',
            },
        },
        rules: {
            // Code complexity
            'complexity': ['error', { max: 25 }],
            'max-depth': ['error', 4],
            'max-nested-callbacks': ['error', 3],

            // Code style
            'semi': ['error', 'always'],
            'curly': ['error', 'all'],
            'brace-style': ['error', '1tbs', { allowSingleLine: false }],
            'object-curly-spacing': ['error', 'always'],
            'keyword-spacing': ['error', { before: true, after: true }],
            'space-before-blocks': ['error', 'always'],
            'space-infix-ops': 'error',
            'indent': ['error', 4],
            'no-multi-spaces': 'error',
            'comma-spacing': ['error', { before: false, after: true }],
            'key-spacing': ['error', { beforeColon: false, afterColon: true }],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'jsx-quotes': ['error', 'prefer-double'],
            'comma-dangle': ['error', 'always-multiline'],
            'eol-last': ['error', 'always'],
            'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
            'no-trailing-spaces': 'error',

            // Best practices
            'eqeqeq': ['error', 'always', { null: 'ignore' }],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            'no-alert': 'warn',
            'no-eval': 'error',
            'no-implied-eval': 'error',
        },
    },
]);

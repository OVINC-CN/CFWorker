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
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'complexity': ['error', { max: 20 }],
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
        },
    },
]);

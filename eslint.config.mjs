import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';

// MUI equivalents for native HTML elements — used by the prefer-mui custom rule
const MUI_EQUIVALENTS = {
  div: 'Box',
  p: 'Typography',
  span: 'Typography (with component="span")',
  h1: 'Typography variant="h1"',
  h2: 'Typography variant="h2"',
  h3: 'Typography variant="h3"',
  h4: 'Typography variant="h4"',
  h5: 'Typography variant="h5"',
  h6: 'Typography variant="h6"',
  button: 'Button or IconButton',
  input: 'TextField or Input',
  a: 'Link (@mui/material)',
  ul: 'List',
  ol: 'List',
  li: 'ListItem or ListItemText',
};

// Reports when native HTML elements with MUI equivalents are used in the app workspace
const preferMuiRule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prefer MUI components over native HTML elements' },
    messages: {
      preferMui:
        'Use MUI <{{ mui }}> instead of <{{ element }}>. Confirm with the team before deviating from MUI.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const name = node.name?.name;
        if (typeof name === 'string' && MUI_EQUIVALENTS[name]) {
          context.report({
            node,
            messageId: 'preferMui',
            data: { element: name, mui: MUI_EQUIVALENTS[name] },
          });
        }
      },
    };
  },
};

export default tseslint.config(
  // --- Ignores ---
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.expo/**',
      '**/dist/**',
      '**/build/**',
      '**/*.config.{js,mjs,cjs}',
      '**/babel.config.js',
      '**/metro.config.js',
      // Generated files — do not lint
      '**/*.types.ts',
      '**/packages/backend/**',
    ],
  },

  // --- Base JS rules ---
  js.configs.recommended,

  // --- TypeScript rules for all TS/TSX ---
  ...tseslint.configs.recommended,

  // --- React + custom SJRD rules ---
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      sjrd: { rules: { 'prefer-mui': preferMuiRule } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // React
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        // Types and interfaces must be PascalCase
        { selector: 'typeLike', format: ['PascalCase'] },
        // Variables: camelCase, PascalCase (components), or UPPER_CASE (module constants)
        { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
        // Named functions: camelCase or PascalCase (React components)
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        // Parameters: camelCase, underscore prefix allowed for unused
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
      ],

      // File length — warn at 300 lines, signals a file doing too much
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],

      // Function length — warn at 250 lines, signals a function doing too much
      'max-lines-per-function': [
        'warn',
        { max: 250, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],

      // Quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  // --- MUI enforcement for apps/app (which uses @mui/material) ---
  {
    files: ['apps/app/**/*.{ts,tsx}'],
    rules: {
      'sjrd/prefer-mui': 'warn',
    },
  },

  // --- Next.js rules for apps/web ---
  {
    files: ['apps/web/**/*.{ts,tsx,js,jsx}'],
    plugins: { '@next/next': nextPlugin },
    settings: { next: { rootDir: 'apps/web' } },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // --- Prettier disables conflicting formatting rules (must be last) ---
  prettierConfig,
);

import myPlugin from './plugin';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    plugins: { my: myPlugin },
    rules: {
      'my/enforce-foo-bar': 'error',
    },
  },
];

module.exports = {
  overrides: [
    {
      files: ['.prettierrc', '.babelrc', '.eslintrc', '.stylelintrc'],
      options: {
        parser: 'json',
      },
    },
  ],
  trailingComma: 'all',
  tabWidth: 2,
  singleQuote: true,
  semi: false,
}

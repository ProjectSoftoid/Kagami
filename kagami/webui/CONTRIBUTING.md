# Contributing Guidelines

## Code Linting

We use [xo](https://github.com/xojs/xo) for linting. Please run `npm run lint` before committing your changes.

### Basic Rules

- Use 2 spaces for indentation.
- Use single quotes for strings.
- Use `const` and `let` instead of `var`.
- Use `===` instead of `==`.
- Semicolon in the end of statement is required.
- Component names should be in PascalCase.

For the full list of rules, please refer to [eslint-config-xo](https://github.com/xojs/eslint-config-xo/blob/main/index.js).

### Integration with VS Code

You can use the [xo-vscode](https://marketplace.visualstudio.com/items?itemName=samverschueren.linter-xo) extension to integrate xo with VS Code. It will show you linting errors in the editor.

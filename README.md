# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# Lerni
<img width="1728" height="1085" alt="Screenshot 2026-04-17 at 12 13 38" src="https://github.com/user-attachments/assets/72b174ec-5ab3-4183-aaab-82d2a5850e7c" />
<img width="1728" height="1087" alt="Screenshot 2026-04-17 at 12 13 13" src="https://github.com/user-attachments/assets/81c98568-bdb4-4e3d-b5ed-07ee656bfa77" />
<img width="1728" height="1085" alt="Screenshot 2026-04-17 at 12 14 00" src="https://github.com/user-attachments/assets/a8620cd8-176f-483d-849f-3db20f252911" />
<img width="1728" height="965" alt="Screenshot 2026-04-17 at 12 14 43" src="https://github.com/user-attachments/assets/87b945f7-cb42-42d2-81ef-58c1bb60f2cb" />
<img width="388" height="842" alt="Screenshot 2026-04-17 at 13 21 38" src="https://github.com/user-attachments/assets/271440db-dc35-40d8-a446-7b9c218e9475" />
<img width="351" height="731" alt="Screenshot 2026-04-17 at 13 23 03" src="https://github.com/user-attachments/assets/06682772-642c-4dda-9439-dd4f3c493779" />





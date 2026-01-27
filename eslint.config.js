import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  // Ignorar archivos de build y node_modules
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js", "*.config.ts"],
  },

  // Reglas base de JavaScript
  js.configs.recommended,

  // Reglas de TypeScript (strict)
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // Configuración específica para archivos TypeScript
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Reglas de React Hooks (compatible con Preact)
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Reglas personalizadas
  {
    rules: {
      // TypeScript estricto
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off", // Demasiado verboso para componentes
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",

      // Permitir template literals sin variables (útil para HTML strings)
      "@typescript-eslint/restrict-template-expressions": "off",

      // Calidad de código
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
  },

  // Desactivar reglas que conflictúan con Prettier
  prettier
);

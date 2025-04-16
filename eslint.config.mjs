import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});
const eslintConfig = [
  ...compat.config({
    extends: ["next"],
    rules: {
      // " @typescript-eslint/no-unused-vars": "off",
      // " @typescript-eslint/no-explicit-any": "off",
    },
  }),
];
export default eslintConfig;

module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2021,
        sourceType: "module",
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/vue3-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended" // <-- integrates prettier
    ],
    rules: {
        // Example custom rules
        "@typescript-eslint/no-explicit-any": "warn",
        "vue/multi-word-component-names": "off",
    },
}

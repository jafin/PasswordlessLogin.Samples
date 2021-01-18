module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser

    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },

    settings: {
        react: {
            version: "detect"
        }
    },

    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:react/recommended'
    ],

    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off"
    },
};

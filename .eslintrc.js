module.exports = {
    "root": true,
    "env": {
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb-typescript-prettier", 
        // "koa"
    ],
    "rules": {
        "no-console": 1
    }
};
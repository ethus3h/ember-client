module.exports = {
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-case-declarations": "off",
        "no-unreachable": "off",
        "no-console": "off",
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};

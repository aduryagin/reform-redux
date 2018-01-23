module.exports = {
  "parser": "babel-eslint",
  "plugins": [
    "flowtype",
    "prettier"
  ],
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:flowtype/recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": ["error"],
    "strict": 0,
    "eol-last": [
      "error",
      "always"
    ],
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};

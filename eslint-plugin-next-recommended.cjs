const unnecessarilyClientDeclaration = require("./rules/unnecessarily-client-declaration.cjs");
const requireUseClientRule = require("./rules/require-use-client.cjs");
const asyncComponentNoHooks = require("./rules/async-component-no-hooks.cjs");

module.exports = {
  rules: {
    'unnecessarily-client-declaration': unnecessarilyClientDeclaration,
    'require-use-client': requireUseClientRule,
    'async-component-no-hooks': asyncComponentNoHooks,
  },
};

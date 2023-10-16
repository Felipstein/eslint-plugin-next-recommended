const unnecessarilyClientDeclaration = require("./rules/unnecessarily-client-declaration.cjs");
const requireUseClientRule = require("./rules/require-use-client.cjs");

module.exports = {
  rules: {
    'require-use-client': requireUseClientRule,
    'unnecessarily-client-declaration': unnecessarilyClientDeclaration,
  },
};

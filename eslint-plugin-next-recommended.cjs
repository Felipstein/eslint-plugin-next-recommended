const unnecessarilyClientDeclaration = require("./rules/unnecessarily-client-declaration.cjs");
const requireUseClient = require("./rules/require-use-client.cjs");
const asyncComponentNoHooks = require("./rules/async-component-no-hooks.cjs");
const asyncServerActions = require("./rules/async-server-actions.cjs");
const asyncExportedServerActions = require("./rules/async-exported-server-actions.cjs");

module.exports = {
  rules: {
    'unnecessarily-client-declaration': unnecessarilyClientDeclaration,
    'require-use-client': requireUseClient,
    'async-component-no-hooks': asyncComponentNoHooks,
    'async-server-actions': asyncServerActions,
    'async-exported-server-actions': asyncExportedServerActions,
  },
};

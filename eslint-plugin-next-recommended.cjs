const unnecessarilyClientDeclaration = require("./rules/unnecessarily-client-declaration.cjs");
const requireUseClient = require("./rules/require-use-client.cjs");
const asyncComponentNoHooks = require("./rules/async-component-no-hooks.cjs");
const asyncServerActions = require("./rules/async-server-actions.cjs");
const asyncExportedServerActions = require("./rules/async-exported-server-actions.cjs");
const exportServerActionsOnly = require("./rules/export-server-actions-only.cjs");

module.exports = {
  configs: {
    recommended: {
      plugins: ['next-recommended'],
      rules: {
        "next-recommended/require-use-client": "error",
        "next-recommended/unnecessarily-client-declaration": "warn",
        "next-recommended/async-component-no-hooks": "error",
        "next-recommended/async-server-actions": "error",
        "next-recommended/async-exported-server-actions": "error",
        "next-recommended/export-server-actions-only": "error",
      },
    },
  },

  rules: {
    'unnecessarily-client-declaration': unnecessarilyClientDeclaration,
    'require-use-client': requireUseClient,
    'async-component-no-hooks': asyncComponentNoHooks,
    'async-server-actions': asyncServerActions,
    'async-exported-server-actions': asyncExportedServerActions,
    'export-server-actions-only': exportServerActionsOnly,
  },
};

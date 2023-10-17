const { isDeclaredUseServer } = require('../utils.cjs');

function isServerActionButNotAsync(node) {
  const isAsync = node.async;

  if(node.body?.type === 'BlockStatement') {
    const functionBlockBody = node.body;

    if(isDeclaredUseServer(functionBlockBody) && !isAsync) {
      return true;
    }
  }

  return false;
}

function reportServerActionsMustBeAsync(context, node) {
  context.report({
    node,
    message: 'Server actions must be async functions.',
    fix: (fixer) => fixer.insertTextBefore(node, 'async '),
  });
}

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'Server actions must be async functions.',
    },

    fixable: 'code',
  },

  create(context) {
    return {
      FunctionDeclaration(node) {
        if(isServerActionButNotAsync(node)) {
          reportServerActionsMustBeAsync(context, node);
        }
      },

      FunctionExpression(node) {
        if(isServerActionButNotAsync(node)) {
          reportServerActionsMustBeAsync(context, node);
        }
      },

      ArrowFunctionExpression(node) {
        if(isServerActionButNotAsync(node)) {
          reportServerActionsMustBeAsync(context, node);
        }
      },
    };
  },
};

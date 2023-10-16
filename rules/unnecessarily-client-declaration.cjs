const { isDeclaredUseClient, isHookCall, isInteractivityAttribute } = require('../utils.cjs');

module.exports = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'Client-side component declared as "use client" without any interactivity, which is unnecessary.',
    },

    fixable: "code",
  },

  create(context) {
    let useClientIsDeclared = false;
    let hasInteractivity = false;
    let firstStatement = null;

    return {
      Program(node) {
        if(isDeclaredUseClient(node)) {
          useClientIsDeclared = true;
          firstStatement = node.body[0]
        }
      },

      CallExpression(node) {
        if (isHookCall(node)) {
          hasInteractivity = true;
        }
      },

      JSXIdentifier(node) {
        if(isInteractivityAttribute(node)) {
          hasInteractivity = true;
        }
      },

      'Program:exit'(node) {
        if(!hasInteractivity && useClientIsDeclared) {
          context.report({
            node: firstStatement,
            message: `Client-side component declared as "use client" without any interactivity or hooks, which is unnecessary.`,
            fix: (fixer) => {
              const sourceCode = context.getSourceCode();

              const useClientNode = sourceCode.getFirstToken(node);
              const useClientLine = useClientNode.loc.start.line;

              const startOfLine = sourceCode.getIndexFromLoc({
                line: useClientLine,
                column: 0,
              });
              const endOfLine = sourceCode.getIndexFromLoc({
                line: useClientLine + 1,
                column: 0,
              });

              return fixer.removeRange([startOfLine, endOfLine]);
            },
          });
        }
      }
    };
  },
}

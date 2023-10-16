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
    let hasHook = false;
    let firstStatement = null;

    return {
      Program(node) {
        const body = node.body;

        if (body.length === 0) {
          return;
        }

        if (body[0].type === 'ExpressionStatement') {
          const expression = body[0].expression;

          if (expression.value === 'use client') {
            useClientIsDeclared = true;
            firstStatement = body[0]
          }
        }
      },

      CallExpression(node) {
        const callee = node.callee;

        if (callee.type === 'Identifier' && callee.name.startsWith('use')) {
          hasHook = true;
        }
      },

      'Program:exit'(node) {
        if(!hasHook && useClientIsDeclared) {
          context.report({
            node: firstStatement,
            message: 'Client-side component declared as "use client" without any interactivity, which is unnecessary.',
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

const { interactivityAttributes } = require('../utils.cjs');

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'Hooks and interactivity are only available for files declared as "use client"',
    },

    fixable: 'code',
  },

  create(context) {
    let useClientIsDeclared = false;
    let firstStatement = null;

    return {
      Program(node) {
        const body = node.body

        if(body.length === 0) {
          return
        }

        if(body[0].type === 'ExpressionStatement') {
          const expression = body[0].expression;

          if(expression.value === 'use client') {
            useClientIsDeclared = true
          }
        }

        if(!useClientIsDeclared) {
          firstStatement = body[0]
        }
      },

      CallExpression(node) {
        const callee = node.callee

        if(callee.type === 'Identifier' && callee.name.startsWith('use')) {
          if(!useClientIsDeclared) {
            context.report({
              node,
              message: `You must declare 'use client' at the beginning of this file before using hooks inside a component. Hooks (like ${callee.name}) only work on client-side components.`,
              fix: (fixer) => (
                fixer.insertTextBefore(firstStatement, "'use client'\n\n")
              )
            })
          }
        }
      },

      JSXIdentifier(node) {
        if(interactivityAttributes.includes(node.name)) {
          if(!useClientIsDeclared) {
            context.report({
              node,
              message: `You must declare 'use client' at the beginning of this file before using interactivity inside a component. Interactivity (like ${node.name}) only work on client-side components.`,
              fix: (fixer) => (
                fixer.insertTextBefore(firstStatement, "'use client'\n\n")
              )
            })
          }
        }
      }
    };
  },
};

const { isDeclaredUseClient, isHookCall, isInteractivityAttribute } = require('../utils.cjs');

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'Hooks and interactivity are only available for files declared as "use client". See: https://nextjs.org/docs/app/building-your-application/rendering/client-components#using-client-components-in-nextjs',
    },

    fixable: 'code',
  },

  create(context) {
    let useClientIsDeclared = false;
    let firstStatement = null;

    return {
      Program(node) {
        if(isDeclaredUseClient(node)) {
          useClientIsDeclared = true;
        } else {
          firstStatement = node.body[0]
        }
      },

      CallExpression(node) {
        if(isHookCall(node) && !useClientIsDeclared) {
          context.report({
            node,
            message: `You must declare 'use client' at the beginning of this file before using hooks inside a component. Hooks (like ${node.callee.name}) only work on client-side components. See: https://nextjs.org/docs/app/building-your-application/rendering/client-components#using-client-components-in-nextjs`,
            fix: (fixer) => (
              fixer.insertTextBefore(firstStatement, "'use client'\n\n")
            )
          });
        }
      },

      JSXIdentifier(node) {
        if(isInteractivityAttribute(node) && !useClientIsDeclared) {
          context.report({
            node,
            message: `You must declare 'use client' at the beginning of this file before using interactivity inside a component. Interactivity (like ${node.name}) only work on client-side components. See: https://nextjs.org/docs/app/building-your-application/rendering/client-components#using-client-components-in-nextjs`,
            fix: (fixer) => (
              fixer.insertTextBefore(firstStatement, "'use client'\n\n")
            )
          });
        }
      }
    };
  },
};

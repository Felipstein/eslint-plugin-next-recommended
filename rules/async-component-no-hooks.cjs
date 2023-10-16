module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: "Client Side components declared as asynchronous (async) should not use hooks. Asynchronous components are intended for Server Side execution and do not support client side specific functionality like hooks. This error is often caused by accidentally adding 'use client' to a module that was originally written for the server. See: https://nextjs.org/docs/messages/no-async-client-component",
    },
  },

  create(context) {
    let asyncFunctionsDeclared = null;

    return {
      FunctionDeclaration(node) {
        if(node.async) {
          asyncFunctionsDeclared = node
        } else if(asyncFunctionsDeclared) {
          asyncFunctionsDeclared = null
        }
      },

      CallExpression(node) {
        const callee = node.callee

        if(callee.type === 'Identifier' && callee.name.startsWith('use')) {
          if(asyncFunctionsDeclared) {
            // If stop working, uncomment this verification line
            // const hookCallLoc = node.loc;
            // const componentLoc = asyncFunctionsDeclared.loc;
            // if((!hookCallLoc.start.line >= componentLoc.start.line && hookCallLoc.end.line <= componentLoc.end.line)) {
            //   return;
            // }

            context.report({
              node: asyncFunctionsDeclared,
              message: "Client Side components declared as asynchronous (async) should not use hooks. Asynchronous components are intended for Server Side execution and do not support client side specific functionality like hooks. This error is often caused by accidentally adding 'use client' to a module that was originally written for the server. See: https://nextjs.org/docs/messages/no-async-client-component"
            });
          }
        }
      },
    };
  },
};

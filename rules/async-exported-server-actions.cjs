const { isDeclaredUseServer } = require('../utils.cjs');

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'Server actions must be async functions.',
    },

    fixable: 'code',
  },

  create(context) {
    let useServerIsDeclared = false;

    const exportedNoAsyncFunctions = [];
    const exportedUnknownNames = new Set();

    return {
      Program(node) {
        if(isDeclaredUseServer(node)) {
          useServerIsDeclared = true;
        }
      },

      ExportNamedDeclaration(node) {
        const declaration = node.declaration;

        if(declaration?.type === 'FunctionDeclaration') {
          if(!declaration.async) {
            exportedNoAsyncFunctions.push(declaration);
          }
        } else if(declaration?.type === 'VariableDeclaration') {
          if(declaration.declarations && declaration.declarations.length > 0 && declaration.declarations[0].type === 'VariableDeclarator') {
            const variableDeclarator = declaration.declarations[0];
            const initialValue = variableDeclarator.init;

            if((initialValue?.type === 'FunctionExpression' || initialValue?.type === 'ArrowFunctionExpression') && !initialValue.async) {
              exportedNoAsyncFunctions.push(initialValue);
            }
          }
        } else if(!declaration && node.specifiers && node.specifiers.length > 0) {
          node.specifiers.forEach((exportSpecifier) => {
            if(exportSpecifier.type === 'ExportSpecifier' && (exportSpecifier.exported || exportSpecifier.local)) {
              const name = exportSpecifier.exported?.name || exportSpecifier.local?.name;

              if(name) {
                exportedUnknownNames.add(name);
              }
            }
          });
        }
      },

      ExportDefaultDeclaration(node) {
        const declaration = node.declaration;

        if(declaration?.type === 'FunctionDeclaration') {
          if(!declaration.async) {
            exportedNoAsyncFunctions.push(declaration);
          }
        } else if(declaration?.type === 'ArrowFunctionExpression') {
          if(!declaration.async) {
            exportedNoAsyncFunctions.push(declaration);
          }

        /**
         * This check is actually unnecessary, as next does not accept any
         * exports other than asynchronous functions within files declared as
         * "use server"
         */
        } else if(declaration?.type === 'ObjectExpression' && declaration.properties && declaration.properties.length > 0) {
          declaration.properties.filter(property => property.type === 'Property').forEach(property => {
            const propertyValue = property.value;

            if(property.shorthand || propertyValue?.type === 'Identifier') {
              const name = propertyValue?.name || property.key?.name;

              if(name) {
                exportedUnknownNames.add(name);
              }
            } else if(isFunction(propertyValue) && !propertyValue.async) {
              exportedNoAsyncFunctions.push(propertyValue);
            }
          })
        }
      },

      'Program:exit'(node) {
        if(!useServerIsDeclared || !node.body || node.body.length === 0) {
          return;
        }

        console.log({ exportedNoAsyncFunctions });

        if(exportedUnknownNames.size > 0) {
          node.body.filter(isFunction).forEach((func) => {
            const name = func.id?.name;

            if(name && exportedUnknownNames.has(name) && !func.async) {
              exportedNoAsyncFunctions.push(func);
            }
          })

          exportedUnknownNames.clear();
        }

        exportedNoAsyncFunctions.forEach((node) => {
          context.report({
            node,
            message: 'Server actions must be async functions.',
          });
        })
      },
    };
  },
};

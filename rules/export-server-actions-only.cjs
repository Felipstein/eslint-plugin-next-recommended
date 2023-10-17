const { isDeclaredUseServer, isFunction } = require('../utils.cjs');

function report(context, node, invalidExportFound) {
  let message = 'Only async functions are allowed to be exported in a "use server" file.';

  if(invalidExportFound) {
    message += ` Found "${invalidExportFound}".`
  }

  context.report({
    node,
    message,
  });
}

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'Ensure that in server action files, only functions related to server actions can be exported. Exporting anything other than functions in this context raises an exception from NextJS',
    },
  },

  create(context) {
    let useServerIsDeclared = false;

    const exportedUnknownNames = new Set();

    return {
      Program(node) {
        if(isDeclaredUseServer(node)) {
          useServerIsDeclared = true;
        }
      },

      ExportNamedDeclaration(node) {
        if(!useServerIsDeclared) {
          return;
        }

        const declaration = node.declaration;

        if(declaration) {
          let invalidExportFound = null;

          if(declaration?.type === 'VariableDeclaration') {
            if(declaration.declarations && declaration.declarations.length > 0 && declaration.declarations[0].type === 'VariableDeclarator') {
              const variableDeclarator = declaration.declarations[0];
              const initialValue = variableDeclarator.init;

              if(isFunction(initialValue)) {
                return;
              }

              if(initialValue?.type === 'Literal') {
                invalidExportFound = initialValue.value;
              }
            }
          }

          if(isFunction(declaration)) {
            return;
          }

          report(context, node, invalidExportFound)
        } else if(node.specifiers && node.specifiers.length > 0) {
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

        if(isFunction(declaration)) {
          return;
        }

        let invalidExportFound = null;

        if(declaration?.type === 'Literal') {
          invalidExportFound = declaration.value;
        }

        report(context, node, invalidExportFound)
      },

      'Program:exit'(node) {
        if(!useServerIsDeclared || !node.body || node.body.length === 0) {
          return;
        }

        if(exportedUnknownNames.size > 0) {
          node.body.filter((item) => !isFunction(item) && item.type === 'VariableDeclaration').forEach((declaration) => {
            if(declaration.declarations && declaration.declarations.length > 0 && declaration.declarations[0].type === 'VariableDeclarator') {
              const variableDeclarator = declaration.declarations[0];

              const variableName = variableDeclarator.id?.name;

              if(variableName && exportedUnknownNames.has(variableName)) {
                report(context, node, variableDeclarator.init?.value);
              }
            }
          })
        }
      },
    };
  },
};

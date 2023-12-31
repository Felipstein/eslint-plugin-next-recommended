const util = require('util');

const interactivityAttributes = ['onClick', 'onChange'];

function isHookCall(node) {
  const callee = node.callee

  return callee.type === 'Identifier' && callee.name.startsWith('use');
}

function isInteractivityAttribute(node) {
  return interactivityAttributes.includes(node.name);
}

function isDeclaredInTopLevel(node, literalDeclaration) {
  if(!node) {
    return false;
  }

  const body = node.body;

  if(!body || body.length === 0) {
    return false;
  }

  if(body[0].type === 'ExpressionStatement') {
    const expression = body[0].expression;

    return expression.value === literalDeclaration;
  }
}

function isDeclaredUseServer(node) {
  return isDeclaredInTopLevel(node, 'use server');
}

function isDeclaredUseClient(node) {
  return isDeclaredInTopLevel(node, 'use client');
}

function isFunction(node) {
  if(!node) {
    return false;
  }

  return node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression';
}

function isAsyncFunction(node) {
  return isFunction(node) && node.async;
}

function isNotAsyncFunction(node) {
  return isFunction(node) && !node.async;
}

function inspect(obj, full = true) {
  if(full) {
    console.log(util.inspect(obj, false, null, true));
  } else {
    console.log(obj)
  }
}

function reportServerActionsMustBeAsync(context, node, isExportedServerActions = false, fixable = true) {
  const name = node.id?.name;

  let message = 'Server actions must be async functions.';

  if(isExportedServerActions && name) {

    message += ` Function ${name} is being exported as a server action, but is not declared async.`
  }

  context.report({
    node,
    message,
    fix: fixable ? (fixer) => fixer.insertTextBefore(node, 'async ') : undefined,
  });
}

module.exports = {
  interactivityAttributes,
  isHookCall,
  isInteractivityAttribute,
  isDeclaredInTopLevel,
  isDeclaredUseServer,
  isDeclaredUseClient,
  isFunction,
  isAsyncFunction,
  isNotAsyncFunction,
  inspect,
  reportServerActionsMustBeAsync,
};

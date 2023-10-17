const interactivityAttributes = ['onClick', 'onChange'];

function isHookCall(node) {
  const callee = node.callee

  return callee.type === 'Identifier' && callee.name.startsWith('use');
}

function isInteractivityAttribute(node) {
  return interactivityAttributes.includes(node.name);
}

function isDeclaredInTopLevel(node, literalDeclaration) {
  const body = node.body;

  if(body.length === 0) {
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

module.exports = {
  interactivityAttributes,
  isHookCall,
  isInteractivityAttribute,
  isDeclaredInTopLevel,
  isDeclaredUseServer,
  isDeclaredUseClient,
};

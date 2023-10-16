const interactivityAttributes = ['onClick', 'onChange'];

function isHookCall(node) {
  const callee = node.callee

  return callee.type === 'Identifier' && callee.name.startsWith('use');
}

function isInteractivityAttribute(node) {
  return interactivityAttributes.includes(node.name);
}

function isDeclaredUseClient(node) {
  const body = node.body;

  if(body.length === 0) {
    return false;
  }

  if(body[0].type === 'ExpressionStatement') {
    const expression = body[0].expression;

    return expression.value === 'use client';
  }
}

module.exports = {
  interactivityAttributes,
  isHookCall,
  isInteractivityAttribute,
  isDeclaredUseClient,
};

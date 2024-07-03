export const enum NodeTypes {
  TEXT,
  ROOT,
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  COMPOUND_EXPRESSION,
}

export const enum ElementTypes {
  ELEMENT,
}

export const enum TagType {
  Start,
  End,
}

export function createSimpleExpression(content) {
  return {
    type: NodeTypes.SIMPLE_EXPRESSION,
    content,
  };
}

export function createInterpolation(content) {
  return {
    type: NodeTypes.INTERPOLATION,
    content: content,
  };
}

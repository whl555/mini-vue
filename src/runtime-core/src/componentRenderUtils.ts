/**
 * 是否应当更新component
 * @param prev
 * @param cur
 */
export function shouldUpdateComponent(prev, cur) {
  const { props: prevProps } = prev;
  const { props: nextProps } = cur;
  // 如果之前没有 props，那么就需要看看现在有没有 props 了
  // 所以这里基于 nextProps 的值来决定是否更新
  if (!prevProps) {
    return !!nextProps;
  }
  // 之前有值，现在没值，那么肯定需要更新
  if (!nextProps) {
    return true;
  }

  // 以上都是比较明显的可以知道 props 是否是变化的
  // 在 hasPropsChanged 会做更细致的对比检测
  return hasPropsChanged(prevProps, nextProps);
}

function hasPropsChanged(prevProps, nextProps) {
  const nextKeys = Object.keys(nextProps);
  const prevKeys = Object.keys(prevProps);

  if (nextKeys.length != prevKeys.length) return true;

  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }

  return false;
}

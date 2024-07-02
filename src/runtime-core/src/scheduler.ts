let queue: any[] = [];

const p = Promise.resolve();
let isFlushPending = false; // 保证Promise调用只有一次

/**
 * 将fn放入微任务异步执行（更新逻辑之后）
 * @param fn
 * @returns
 */
export function nextTick(fn?) {
  return fn ? p.then(fn) : p;
}

/**
 * 添加job
 * @param job
 */
export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }

  queueFlush();
}

/**
 *
 */
function queueFlush() {
  if (isFlushPending) return;
  isFlushPending = true;

  nextTick(flushJobs);
}

/**
 * 执行job
 */
function flushJobs() {
  let job;
  isFlushPending = false;
  while ((job = queue.shift())) {
    job && job();
  }
}

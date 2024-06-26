let _instance = {};
export function getCurrentInstance() {
  return _instance ? _instance : {};
}

export function setCurrentInstance(instance) {
  _instance = instance;
}

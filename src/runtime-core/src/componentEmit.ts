import { camelize, toHandlerKey } from "../../shared";

export function emit(instance, event, ...args) {
  console.log("emit", event);
  const { props } = instance;
  const key = toHandlerKey(camelize(event));
  const handler = props[key];
  handler && handler(...args);
}

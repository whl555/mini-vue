import { createApp } from "../../dist/mini-vue.esm-bundler.js";
import App from "./App.js";

// todo createApp mount
const rootContainer = document.querySelector("#root");
createApp(App).mount(rootContainer);

import { render } from "preact";
import "./index.css";
import { App } from "./app.tsx";

const rootElement = document.getElementById("app");

if (rootElement) {
  render(<App />, rootElement);
} else {
  throw new Error("Root element #app not found in document");
}

// Import stylesheets
import "./style.css";
import { Game } from "./game";

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById("app");
appDiv.innerHTML = `<h1>TypeScript Starter Project So please ignore</h1>`;

new Game(640, 480);

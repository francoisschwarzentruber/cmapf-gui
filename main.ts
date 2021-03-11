import { GUIExecution } from './src/GUIexecution.js';
import { GUIedition } from "./src/GUIedition.js";



window.onload = () => {
    GUIedition.init();
    GUIExecution.init();
}
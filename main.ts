import { GUIPngFileNames } from './src/GUIPngFileNames.js';
import { GUIExecution } from './src/GUIexecution.js';
import { GUIInstance } from "./src/GUIInstance.js";



window.onload = () => {
    GUIPngFileNames.init();
    GUIInstance.init();
    GUIExecution.init();
}
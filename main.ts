import { GUIMap } from './src/GUIMap.js';
import { GUIPngFileNames } from './src/GUIPngFileNames.js';
import { GUIExecution } from './src/GUIexecution.js';
import { GUIInstance } from "./src/GUIInstance.js";



window.onload = () => {
    GUIMap.init();
    GUIPngFileNames.init();
    GUIInstance.init();
    GUIExecution.init();

    document.getElementById("execution").oninput = () => {
        GUIExecution.loadFromString((<HTMLTextAreaElement> document.getElementById("execution")).value);
    }
}
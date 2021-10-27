import { GUIMap } from './src/GUIMap.js';
import { GUIPngFileNames } from './src/GUIPngFileNames.js';
import { GUIExecution } from './src/GUIexecution.js';
import { GUIInstance } from "./src/GUIInstance.js";



window.onload = () => {
    GUIMap.init();
    GUIPngFileNames.init();
    GUIInstance.init();
    GUIExecution.init();

    const updateCurrentExecutionTextArea = () => {
        const textarea = (<HTMLTextAreaElement>document.getElementById("executions"));
        const nbLine = textarea.value.substr(0, textarea.selectionStart).split("\n").length-1;
        console.log(nbLine)
        const line = textarea.value.split("\n")[nbLine];
        GUIExecution.loadFromString(line);
    };

    document.getElementById("executions").onkeyup = updateCurrentExecutionTextArea;
    document.getElementById("executions").onclick = updateCurrentExecutionTextArea;
}
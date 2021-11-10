import { GUIMap } from './src/GUIMap.js';
import { GUIPngFileNames } from './src/GUIPngFileNames.js';
import { GUIExecution } from './src/GUIexecution.js';
import { GUIInstance } from "./src/GUIInstance.js";



window.onload = () => {
    GUIMap.init();
    GUIPngFileNames.init();
    GUIInstance.init();
    GUIExecution.init();

    const textArea = <HTMLTextAreaElement> document.getElementById("textarea");
    
    const updateCurrentExecutionTextArea = () => {
        const nbLine = textArea.value.substr(0, textArea.selectionStart).split("\n").length-1;
        const line = textArea.value.split("\n")[nbLine];
        GUIExecution.loadFromString(line);
    };

    textArea.onkeyup = updateCurrentExecutionTextArea;
    textArea.onclick = updateCurrentExecutionTextArea;
    document.getElementById("helptextarea").onclick = () => alert("In the textbox, each line can be either a configuration or an execution. Example of a configuration: <2, 3, 6> is a configuration of three agents where the first agent is at location 2, the second at 3 and the third at 6. Example of an execution: [[1, 4, 5], [2, 7, 8]] is an execution with 2 agents of length 3. The path of the first agent is 1, 4, 5. The path of the second agent is 2, 7, 8. The tool visualizes the configuration, or the execution of the current line.")
}
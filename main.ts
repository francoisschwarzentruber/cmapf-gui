import { GUIMap } from './src/GUIMap.js';
import { GUIPngFileNames } from './src/GUIPngFileNames.js';
import { GUIExecution, textToConfig } from './src/GUIexecution.js';
import { GUIInstance } from "./src/GUIInstance.js";
import { RRTVisualizer } from './src/RRTVisualizer.js';



window.onload = () => {
    GUIMap.init();
    GUIPngFileNames.init();
    GUIInstance.init();
    GUIExecution.init();

    const textArea = <HTMLTextAreaElement>document.getElementById("textarea");

    const updateCurrentExecutionTextArea = async () => {
        const lines = textArea.value.split("\n");
        const nbLine = textArea.value.substr(0, textArea.selectionStart).split("\n").length - 1;
        const line = lines[nbLine].trim();

        RRTVisualizer.init();
        for (const line of lines) {
            if (line.startsWith("image file:"))
                await GUIInstance.load(line.substring(11).trim());
            if (line.startsWith("radius:"))
                (<HTMLInputElement>document.getElementById("inputRadius")).value = line.substring(7).trim();
            else if (line.startsWith("init:"))
                GUIInstance.setInitialConfiguration(textToConfig(line.substring(5)));
            else if (line.startsWith("target:"))
                GUIInstance.setTargetConfiguration(textToConfig(line.substring(7)));
            else
                RRTVisualizer.parseAndAdd(line);
        }
        if (line != "")
            GUIExecution.loadFromString(line);
    };

    textArea.onkeyup = updateCurrentExecutionTextArea;
    textArea.onclick = updateCurrentExecutionTextArea;
    document.getElementById("helptextarea").onclick = () => alert("In the textbox, the output of the tool is displayed. Each line can be either a configuration or an execution (or someelse that will be ignored). Example of a configuration: <2, 3, 6> is a configuration of three agents where the first agent is at location 2, the second at 3 and the third at 6. Example of an execution: [[1, 4, 5], [2, 7, 8]] is an execution with 2 agents of length 3. The path of the first agent is 1, 4, 5. The path of the second agent is 2, 7, 8. The tool visualizes the configuration, or the execution of the current line.")
}
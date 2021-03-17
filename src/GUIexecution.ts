import { GUIInstance } from './GUIInstance.js';
import { GUIMap } from './GUIMap.js';

export class GUIExecution {
    static execution: number[][];

    static init() {
        document.getElementById("buttonCompute").onclick = GUIExecution.compute;

    }

    static get slider() { return (document.getElementById("slider") as HTMLInputElement); }
    static get sliderValue() { return parseInt(GUIExecution.slider.value); }


    static executionLength(): number { return Math.max(...GUIExecution.execution.map((path) => path.length)); }

    static config(t: number) {
        let c = [];
        for (let agent = 0; agent < GUIExecution.execution.length; agent++)
            c.push(GUIExecution.execution[agent][Math.min(GUIExecution.execution[agent].length - 1, t)]);
        return c.map(GUIMap.numberToPoint);
    }


    static agentPointToHTMLElement(i: number, vertex: { x: number, y: number }) {
        const img = new Image();
        img.classList.add("agent");
        img.src = "img/agent.png";
        GUIMap.setPosition(img, vertex);
        GUIMap.forAgentNumber(img, i);
        return img;
    }


    static showConfig(t: number) {
        const c = GUIExecution.config(t);
        document.getElementById("config").innerHTML = "";

        for (let agent = 0; agent < c.length; agent++) {
            document.getElementById("config").appendChild(GUIExecution.agentPointToHTMLElement(agent, c[agent]));
        }
    }


    static load(exec) {
        if (exec.length == 0)
            throw "No solution";
        GUIExecution.execution = exec;
        GUIExecution.slider.setAttribute("max", GUIExecution.executionLength() + "");
        GUIExecution.slider.oninput = () => { GUIExecution.showConfig(GUIExecution.sliderValue) };
        GUIExecution.slider.onchange = () => { GUIExecution.showConfig(GUIExecution.sliderValue) };
    }

    static compute() {
        var fd = new FormData();
        var data = GUIInstance.instance.toObject();
        for (var i in data) {
            fd.append(i, JSON.stringify(data[i]));
        }
        fetch("compute.php", {
            method: 'post',
            body: fd
        }).then((response) => {
            if (response.ok) {
                response.text().then((str) => {
                    GUIExecution.load(eval(str));
                });
            }
        });
    }
}
import { GUIInstance } from './GUIInstance.js';
import { GUIMap } from './GUIMap.js';
import { Point } from './Point.js';




class Execution {
    constructor(private paths: Point[][]) { }

    get agents() {
        const nbAgents = this.paths.length;
        return Array.from(Array(nbAgents).keys())
    }

    config(t: number): Point[] {
        const c = [];
        for (let agent of this.agents) {
            c.push(this.paths[agent][Math.min(this.paths[agent].length - 1, t)]);
        }
        return c;
    }

    path(agent) {
        return this.paths[agent];
    }

    get length() { return Math.max(...this.paths.map((path) => path.length)); }

}



/**
 * @param str a string that represents an execution e.g. "[[1,10,9,8,18,25,32,40,41,42],[65,66,61,62,63,56,50,51,44,45]]"
 *        (an array of paths), or "{[1,10,9,8,18,25,32,40,41,42],[65,66,61,62,63,56,50,51,44,45]}"
 * @return the execution corresponding to str
 */
function textToExecution(str: string): Execution {
    const s = str.replace("{", "[").replace("}", "]");
    return new Execution(eval(s).map((path) => path.map(GUIMap.numberToPoint)));
}



function textToConfig(str: string): Point[] {
    const Astr = str.replace("<", "[").replace(">", "]");
    return eval(Astr).map(GUIMap.numberToPoint);
}



export class GUIExecution {
    static execution: Execution;

    static init() { document.getElementById("buttonCompute").onclick = GUIExecution.compute; }

    static get slider() { return (document.getElementById("slider") as HTMLInputElement); }
    static get sliderValue() { return parseInt(GUIExecution.slider.value); }



    static agentPointToHTMLElement(agentNumber: number, vertex: { x: number, y: number }) {
        const img = new Image();
        img.classList.add("agent");
        img.src = "img/agent.png";
        GUIMap.setPosition(img, vertex);
        GUIMap.setAgentColor(img, agentNumber);
        return img;
    }


    static showConfig(c: Point[]) {
        document.getElementById("config").innerHTML = "";

        for (let agent = 0; agent < c.length; agent++) {
            document.getElementById("config").appendChild(GUIExecution.agentPointToHTMLElement(agent, c[agent]));
        }

        document.getElementById("communication").innerHTML = "";
        const r = GUIInstance.instance.radius;
        for (let agent = 0; agent < c.length; agent++)
            for (let agentb = agent + 1; agentb < c.length; agentb++) {
                if ((c[agent].x - c[agentb].x) ** 2 + (c[agent].y - c[agentb].y) ** 2 <= r ** 2)
                    document.getElementById("communication").appendChild(
                        GUIExecution.getSVGPolyLine([c[agent], c[agentb]]));
            }

    }


    /**
     * 
     * @param inputStr 
     * @description load the content of the inputStr which is one line.
     * inputStr should be either of the form "<1, 4, 9>" and thus represents a configuration.
     * Or it is of the "[[1, 5, 6], [2, 9, 4]]" and represents an execution (here, in the example, an execution
     * of length 3 for two agents)
     */
    static loadFromString(inputStr: string) {
        if (inputStr.startsWith("<")) {
            GUIExecution.showConfigurationFromString(inputStr);
        }
        else
            GUIExecution.showExecutionFromString(inputStr);

    }



    static showConfigurationFromString(inputStr: string) {
        GUIExecution.reset();
        GUIExecution.showConfig(textToConfig(inputStr));
    }

    static showExecutionFromString(inputStr) {
        const exec = textToExecution(inputStr);
        if (exec.length == 0) {
            document.getElementById("nosolution").hidden = false;
            setTimeout(() => document.getElementById("nosolution").hidden = true, 2000);
        }
        else {
            GUIExecution.execution = exec;
            document.getElementById("paths").innerHTML = "";

            for (const agent of exec.agents) {
                document.getElementById("paths").appendChild(GUIExecution.getSVGPolyLine(exec.path(agent)));
            }

            GUIInstance.setInitialTargetConfigurations(exec.config(0), exec.config(exec.length - 1));
            GUIExecution.slider.setAttribute("max", GUIExecution.execution.length + "");
            const f = () => { GUIExecution.showConfig(GUIExecution.execution.config(GUIExecution.sliderValue)) };
            GUIExecution.slider.oninput = f;
            GUIExecution.slider.onchange = f;
            GUIExecution.slider.classList.remove("disabled");
            f();
        }
    }


    static getSVGPolyLine(points: Point[]): SVGPolylineElement {
        const svgns = "http://www.w3.org/2000/svg";
        const shape = document.createElementNS(svgns, "polyline");
        shape.setAttributeNS(null, 'points', points.map(GUIMap.getCenterCell).map((p) => p.x + "," + p.y).join(" "));
        return shape;
    }



    static reset() {
        GUIExecution.execution = undefined;
        GUIExecution.slider.setAttribute("max", 0 + "");
        document.getElementById("config").innerHTML = "";
        GUIExecution.slider.classList.add("disabled");
        document.getElementById("paths").innerHTML = "";
        document.getElementById("communication").innerHTML = "";
    }

    /**
     * call the tool on the server, that is the file compute.php
     */
    static compute() {
        GUIExecution.reset();
        const fd = new FormData();
        const data = GUIInstance.instance.toObject();
        console.log("instance is:");
        console.log(data);
        for (const i in data) {
            fd.append(i, JSON.stringify(data[i]));
        }
        fetch("compute.php", {
            method: 'post',
            body: fd
        }).then((response) => {
            if (response.ok) {
                response.text().then((str) => {
                    console.log(str);
                    (<HTMLTextAreaElement>document.getElementById("textarea")).value = str;
                    /*let lines = str.split("\n");
                    lines = lines.filter((line) => line != "");
                    const lastline = lines[lines.length - 1];
                    console.log(lastline);
                    GUIExecution.loadFromString(lastline);*/
                });
            }
        });
    }
}
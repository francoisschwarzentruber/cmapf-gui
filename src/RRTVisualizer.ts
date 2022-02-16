import { GUIMap } from './GUIMap.js';
import { GUIExecution, textToConfig } from "./GUIexecution.js";
import { Point } from "./Point.js";
import { SVG } from './SVG.js';

export class RRTVisualizer {

    static configs = {};

    static init() {
        RRTVisualizer.configs = {};
        document.getElementById("RRT").innerHTML = "";
    }

    static addConfiguration(configuration: Point[]): void {
        const b = barycenter(configuration);
        const svgns = "http://www.w3.org/2000/svg";
        const shape = document.createElementNS(svgns, "circle");
        const c = GUIMap.getCenterCell(b);
        shape.setAttributeNS(null, "cx", "" + c.x);
        shape.setAttributeNS(null, "cy", "" + c.y);
        shape.setAttributeNS(null, "r", "8");
        shape.onmousemove = () => { GUIExecution.showConfig(configuration); }
        document.getElementById("RRT").appendChild(shape);
    }



    static parseAndAdd(line: string) {
        if (!line.startsWith("RRT edge:"))
            return;
        const txtEdge = line.substring(9);
        const txtEndPoints = txtEdge.split("--");
        txtEndPoints[0] = txtEndPoints[0].trim();
        txtEndPoints[1] = txtEndPoints[1].trim();

        const c1 = textToConfig(txtEndPoints[0]);
        const c2 = textToConfig(txtEndPoints[1]);

        function register(txtC, c) {
            if (!RRTVisualizer.configs[txtC]) {
                RRTVisualizer.configs[txtC] = c;
                RRTVisualizer.addConfiguration(c);
            }
        }

        register(txtEndPoints[0], c1);
        register(txtEndPoints[1], c2);

        const b1 = barycenter(c1);
        const b2 = barycenter(c2);

        document.getElementById("RRT").appendChild(SVG.getSVGPolyLine([b1, b2]));

    }
}



function barycenter(configuration: Point[]): Point {
    let x = 0;
    let y = 0;
    for (const point of configuration) {
        x += point.x;
        y += point.y;
    }
    x = x / configuration.length;
    y = y / configuration.length;
    return { x: x, y: y };
}
import { GUIMap } from "./GUIMap.js";
import { Point } from "./Point.js";

export class SVG {
    static getSVGPolyLine(points: Point[]): SVGPolylineElement {
        const svgns = "http://www.w3.org/2000/svg";
        const shape = document.createElementNS(svgns, "polyline");
        shape.setAttributeNS(null, 'points', points.map(GUIMap.getCenterCell).map((p) => p.x + "," + p.y).join(" "));
        return shape;
    }
}
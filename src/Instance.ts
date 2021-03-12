import { GUIMap } from './GUIMap.js';



export class Instance {
    init: Point[];
    target: Point[];
    graph: string;
    radius = 20;

    toString() {
        return JSON.stringify({
            pngFileName: this.graph,
            init: this.init.map(GUIMap.pointToNumber),
            target: this.target.map(GUIMap.pointToNumber),
            radius: this.radius
        });
    }
}
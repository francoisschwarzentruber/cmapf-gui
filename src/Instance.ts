import { GUIMap } from './GUIMap.js';



export class Instance {
    init: Point[];
    target: Point[];
    pngFileName: string;
    radius = 20;

    toString() {
        return JSON.stringify({
            pngFileName: this.pngFileName,
            init: this.init.map(GUIMap.pointToNumber),
            target: this.target.map(GUIMap.pointToNumber),
            radius: this.radius
        });
    }
}
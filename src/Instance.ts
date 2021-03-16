import { GUIMap } from './GUIMap.js';



export class Instance {
    init: Point[];
    target: Point[];
    pngFileName: string;
    radius = 20;

    toString() {
        return JSON.stringify({
            pngFileName: this.pngFileName,
            init: this.init,
            target: this.target,
            radius: this.radius
        });
    }

    toObject() {
        return {
            pngFileName: this.pngFileName,
            init: this.init,
            target: this.target,
            radius: this.radius
        };
    }
}
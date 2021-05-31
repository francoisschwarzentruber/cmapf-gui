import { GUIMap } from './GUIMap.js';
import { Point } from './Point.js';

/**
 * represents an instance, that is, the initial configuration, the target configuration, the png file used for the map, the radius
 */
export class Instance {
    init: Point[];
    target: Point[];
    pngFileName: string;
    radius = 20;


    /**
     * a "standard version" of the instance (to be used when the instance is given to the server)
     */
    toObject() {
        return {
            pngFileName: this.pngFileName,
            init: this.init.map(GUIMap.pointToNumber),
            target: this.target.map(GUIMap.pointToNumber),
            radius: this.radius
        };
    }
}
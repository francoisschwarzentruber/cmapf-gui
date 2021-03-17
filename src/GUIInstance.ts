import { GUIMap } from './GUIMap.js';
import { Instance } from './Instance.js';



export class GUIInstance {
    private static _instance: Instance; // the instance (png file, init, target, radius)

    static set instance(instance: Instance) {
        GUIInstance._instance = instance;
        GUIInstance.update();
    }

    static get instance(): Instance {
        return GUIInstance._instance;

    }

    static get inputRadius(): HTMLInputElement { return <HTMLInputElement>document.getElementById("inputRadius"); };

    /**
     * 
     * @param pngFileName 
     * @description load the png file and produce a new instance based on it
     */
    static load(pngFileName: string): void {
        const instance = new Instance();
        instance.pngFileName = pngFileName;
        instance.init = [{ x: 1, y: 2 }, { x: 2, y: 3 }];
        instance.target = [{ x: 5, y: 6 }, { x: 6, y: 3 }];
        instance.radius = parseInt(GUIInstance.inputRadius.value);
        GUIInstance.instance = instance;
    }

    /**
     * initialization
     */
    static init() {
        const initialPNGFileName = "smallmaze.png";
        document.getElementById("selectPNGFileName").onchange = () => GUIInstance.load((<HTMLInputElement>document.getElementById("selectPNGFileName")).value);
        (<HTMLInputElement>document.getElementById("selectPNGFileName")).value = initialPNGFileName;
        GUIInstance.load(initialPNGFileName);
        GUIInstance.inputRadius.oninput = () => { GUIInstance.instance.radius = parseInt(GUIInstance.inputRadius.value); };
    }

    /**
     * update the GUI wrt the instance
     */
    static update() {
        GUIMap.load(GUIInstance.instance.pngFileName);
        const initAndTargets = document.getElementById("initAndTargets");
        initAndTargets.innerHTML = "";
        for (let i = 0; i < GUIInstance.instance.init.length; i++)
            initAndTargets.appendChild(GUIInstance.initPointToHTMLElement(i));
        for (let i = 0; i < GUIInstance.instance.target.length; i++)
            initAndTargets.appendChild(GUIInstance.targetPointToHTMLElement(i));
    }

    static initPointToHTMLElement(i: number) {
        const img = new Image();
        img.classList.add("init");
        img.src = "img/init.png";
        GUIMap.setPosition(img, GUIInstance.instance.init[i]);
        GUIMap.forAgentNumber(img, i);
        GUIMap.draggable(img, () => {
            GUIInstance.instance.init[i] = {
                x: img.offsetLeft / GUIMap.zoom,
                y: img.offsetTop / GUIMap.zoom
            };
        });
        return img;
    }


    static targetPointToHTMLElement(i: number) {
        const img = new Image();
        img.classList.add("init");
        img.src = "img/target.png";
        GUIMap.setPosition(img, GUIInstance.instance.target[i]);
        GUIMap.forAgentNumber(img, i);
        GUIMap.draggable(img, () => {
            GUIInstance.instance.target[i] = {
                x: img.offsetLeft / GUIMap.zoom,
                y: img.offsetTop / GUIMap.zoom
            };
        });
        return img;
    }
}
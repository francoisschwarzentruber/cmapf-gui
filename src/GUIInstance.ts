import { GUIExecution } from './GUIexecution.js';
import { GUIMap } from './GUIMap.js';
import { Instance } from './Instance.js';
import { Point } from './Point.js';


/**
 * this static class enables to show an instance. An instance is made up of:
 * - the graph (that comes from a .png)
 * - the initial configuration
 * - the target configuration
 */
export class GUIInstance {
    private static _instance: Instance; // the instance (png file, init, target, radius)


    static set instance(instance: Instance) {
        GUIInstance._instance = instance;
        GUIInstance.update();
    }

    static get instance(): Instance { return GUIInstance._instance; }

    static get inputRadius(): HTMLInputElement { return <HTMLInputElement>document.getElementById("inputRadius"); };

    /**
     * 
     * @param pngFileName 
     * @description load the png file and produce a new instance based on it
     */
    static async load(pngFileName: string): Promise<void> {
        const instance = new Instance();
        instance.pngFileName = pngFileName;
        await GUIMap.load(pngFileName);
        instance.init = [GUIMap.getRandomPoint()];//, GUIMap.getRandomPoint()];
        instance.target = [GUIMap.getRandomPoint()];//[GUIMap.getRandomPoint(), GUIMap.getRandomPoint()];
        instance.radius = parseInt(GUIInstance.inputRadius.value);
        GUIInstance.instance = instance;
        GUIExecution.reset();
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
        document.getElementById("buttonNewAgent").onclick = GUIInstance.addAgent;
    }

    /**
     * @description add a new agent in the instance
     */
    static addAgent() {
        GUIExecution.reset();

        function extendConfig(c: Point[]): void {
            const i = Math.floor(c.length * Math.random());
            let j = 10000;
            while (j > 0) {
                const angle = Math.random() * 2 * Math.PI;
                const r = GUIInstance._instance.radius * Math.random();
                const x = Math.floor(c[i].x + r * Math.cos(angle));
                const y = Math.floor(c[i].y + r * Math.sin(angle));

                if (0 <= x && x < GUIMap.map.length)
                    if (0 <= y && y < GUIMap.map[x].length)
                        if (!GUIMap.map[x][y]) {
                            c.push({ x: x, y: y });
                            return;
                        }
                j--;
            }
            throw "aïe"
        }
        extendConfig(GUIInstance.instance.init);
        extendConfig(GUIInstance.instance.target);
        GUIInstance.update();
    }


    static setInitialConfiguration(initConfig: Point[]): void {
        GUIInstance.instance.init = initConfig;
        GUIInstance.update();
    }

    static setTargetConfiguration(targetConfig: Point[]): void {
        GUIInstance.instance.target = targetConfig;
        GUIInstance.update();
    }


    static setInitialTargetConfigurations(initConfig: Point[], targetConfig: Point[]): void {
        GUIInstance.instance.init = initConfig;
        GUIInstance.instance.target = targetConfig;
        GUIInstance.update();
    }




    /**
     * @description update the GUI wrt the instance
     */
    static update() {
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
        GUIMap.setAgentColor(img, i);
        GUIMap.draggable(img, () => {
            GUIInstance.instance.init[i] = GUIInstance.getPointFromIconPosition(img);
        });
        return img;
    }




    static targetPointToHTMLElement(i: number) {
        const img = new Image();
        img.classList.add("init");
        img.src = "img/target.png";
        GUIMap.setPosition(img, GUIInstance.instance.target[i]);
        GUIMap.setAgentColor(img, i);
        GUIMap.draggable(img, () => {
            GUIInstance.instance.target[i] = GUIInstance.getPointFromIconPosition(img);
        });
        return img;
    }



    /**
     * @returns the coordinate in the map from the coordinate of the icon img
     */
    static getPointFromIconPosition(img: HTMLElement) {
        return {
            x: Math.floor((img.offsetLeft + 16) / GUIMap.zoom),
            y: Math.floor((img.offsetTop + 32) / GUIMap.zoom)
        };
    }
}
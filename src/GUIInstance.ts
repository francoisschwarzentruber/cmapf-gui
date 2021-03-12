import { GUIMap } from './GUIMap.js';
import { Instance } from './Instance.js';



export class GUIInstance {
    private static _instance: Instance;

    static set instance(i) {
        GUIInstance._instance = i;
        GUIInstance.update();
    }

    static get instance() {
        return GUIInstance._instance;

    }

    static get inputRadius() { return <HTMLInputElement> document.getElementById("inputRadius");};

    
    static load(pngFileName: string) {
        const instance = new Instance();
        instance.graph = pngFileName;
        instance.init = [{ x: 1, y: 2 }, { x: 2, y: 3 }];
        instance.target = [{ x: 1, y: 2 }, { x: 2, y: 3 }];
        instance.radius = parseInt(GUIInstance.inputRadius.value);
        GUIInstance.instance = instance;
    }


    static init() {
        document.getElementById("selectPNGFileName").onchange = () => GUIInstance.load((<HTMLInputElement> document.getElementById("selectPNGFileName")).value);
        GUIInstance.load("smallmaze.png");
        GUIInstance.inputRadius.oninput = () => {GUIInstance.instance.radius = parseInt(GUIInstance.inputRadius.value);};
    }

    static update() {
        const map = document.getElementById("map");
        const img = <HTMLImageElement> document.getElementById("background");
        img.src = "graphs/" + GUIInstance.instance.graph;
        img.onload = () => {
            const w = img.width;
            const h = img.height;
            img.style.width = w * GUIMap.zoom + "px";
            img.style.height = h * GUIMap.zoom + "px";
        }
        map.appendChild(img);
        for (let i = 0; i < GUIInstance.instance.init.length; i++)
            map.appendChild(GUIInstance.initPointToHTMLElement(i));
        for (let i = 0; i < GUIInstance.instance.target.length; i++)
            map.appendChild(GUIInstance.targetPointToHTMLElement(i));
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
        GUIMap.setPosition(img, GUIInstance.instance.init[i]);
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
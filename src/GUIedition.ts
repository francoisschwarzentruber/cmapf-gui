import { GUIMap } from './GUIMap.js';
import { Instance } from './Instance.js';



export class GUIedition {
    private static _instance: Instance;

    static set instance(i) {
        GUIedition._instance = i;
        GUIedition.update();
    }

    static get instance() {
        return GUIedition._instance;

    }

    static init() {
        let instance = new Instance();
        instance.graph = "smallmaze.png";
        instance.init = [{ x: 1, y: 2 }, { x: 2, y: 3 }];
        instance.target = [{ x: 1, y: 2 }, { x: 2, y: 3 }];
        GUIedition.instance = instance;
    }

    static update() {
        const map = document.getElementById("map");
        const img = new Image();
        img.src = "graphs/" + GUIedition.instance.graph;
        img.onload = () => {
            const w = img.width;
            const h = img.height;
            img.style.width = w * GUIMap.zoom + "px";
            img.style.height = h * GUIMap.zoom + "px";
        }
        map.appendChild(img);
        for (let i = 0; i < GUIedition.instance.init.length; i++)
            map.appendChild(GUIedition.initPointToHTMLElement(i));
        for (let i = 0; i < GUIedition.instance.target.length; i++)
            map.appendChild(GUIedition.targetPointToHTMLElement(i));
    }

    static initPointToHTMLElement(i: number) {
        const img = new Image();
        img.classList.add("init");
        img.src = "img/init.png";
        GUIMap.setPosition(img, GUIedition.instance.init[i]);
        GUIMap.forAgentNumber(img, i);
        GUIMap.draggable(img, () => {
            GUIedition.instance.init[i] = {
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
        GUIMap.setPosition(img, GUIedition.instance.init[i]);
        GUIMap.forAgentNumber(img, i);
        GUIMap.draggable(img, () => {
            GUIedition.instance.target[i] = {
                x: img.offsetLeft / GUIMap.zoom,
                y: img.offsetTop / GUIMap.zoom
            };
        });
        return img;
    }
}
import { GUIInstance } from './GUIInstance.js';
import { GUIExecution } from './GUIexecution.js';
import { Point } from './Point.js';



/**
 * the map of an area
 */
export class GUIMap {


    static map: boolean[][]; //bitmap of the map (used like map[x][y]). True means obstacle.
    static imgObstacle = new Image(); //image of the obstacle
    static imgMap = new Image();

    static init() {
        GUIMap.imgObstacle.src = "img/obstacle.png";
    }

    /**
     * 
     * @param p the "logical" coordinate of the cell
     * @returns the "physical" coordinate in the canvas
     */
    static getCenterCell(p: Point): Point {
        return { x: p.x * GUIMap.zoom + GUIMap.zoom / 2, y: p.y * GUIMap.zoom + GUIMap.zoom / 2 };
    }


    /**
     * @returns "logical" coordinate in which there is no obstacle
     */
    static getRandomPoint(): Point {
        let i = 100;
        while (i > 0) {
            const x = Math.floor(Math.random() * GUIMap.width);
            const y = Math.floor(Math.random() * GUIMap.height);
            if (!GUIMap.map[x][y])
                return { x: x, y: y };
            i--;
        }

        return { x: 2, y: 2 };
    }
    /**
     * 
     * @param img 
     * @returns the bitmap of the image
     */
    private static _imgToBitMap(img: HTMLImageElement): boolean[][] {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const map: boolean[][] = [];
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0);
        let data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
        for (let x = 0; x < w; x++) map[x] = [];
        for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++)
                map[x][y] = data[(y * w + x) * 4] == 0; //0 = black = obstacle
        return map;
    }


    static load(pngFileName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log("loading png")
            const img = new Image();
            img.src = "graphs/" + pngFileName;
            img.onload = () => {
                GUIMap.imgMap = img;
                GUIMap.map = GUIMap._imgToBitMap(img);

                document.getElementById("paths").style.width = GUIMap.width * GUIMap.zoom + "px";
                document.getElementById("paths").style.height = GUIMap.height * GUIMap.zoom + "px";
                document.getElementById("communication").style.width = GUIMap.width * GUIMap.zoom + "px";
                document.getElementById("communication").style.height = GUIMap.height * GUIMap.zoom + "px";
                GUIMap.drawMap();
                resolve();
            }
        });
    }

    /**
     * draw the map on the canvas
     */
    static drawMap() {
        const canvas = <HTMLCanvasElement>document.getElementById("background");
        canvas.width = this.width * GUIMap.zoom;
        canvas.height = this.height * GUIMap.zoom;
        const ctx = canvas.getContext('2d');

        if(GUIMap.zoom < 2) {
            ctx.drawImage(GUIMap.imgMap, 0, 0, canvas.width, canvas.height);
        }
        else {
            ctx.fillStyle = "green";
            for (let x = 0; x < GUIMap.width; x++)
                for (let y = 0; y < GUIMap.height; y++)
                    if (GUIMap.map[x][y])
                        canvas.getContext('2d').drawImage(GUIMap.imgObstacle, x * GUIMap.zoom, y * GUIMap.zoom, GUIMap.zoom, GUIMap.zoom);
                        //ctx.fillRect(x * GUIMap.zoom, y * GUIMap.zoom, GUIMap.zoom, GUIMap.zoom);
        }

        
    }

    /**
     * 
     * @param element 
     * @param point 
     * @description set the position of the HTMLElement element which is an image of height and width 32*32 at point ("physical" coordinate)
     */
    static setPosition(element: HTMLElement, point: Point) {
        element.style.left = (point.x * GUIMap.zoom + GUIMap.zoom / 2 - 16) + "px";
        element.style.top = (point.y * GUIMap.zoom  + GUIMap.zoom / 2 - 32) + "px";
    }

    /**
     * size in pixels of a cell
     */
    static get zoom(): number {
        //    return 32; 
        return 800 / GUIMap.imgMap.width;
    }

    /**
     * "logical" width and height
     */
    static get width(): number { return this.map.length; }
    static get height(): number { return this.map[0].length; }

    /**
     * 
     * @param p 
     * @returns the label of the node at p where p has no obstacle
     * the label is an integer obtained by reading top to bottom, left to right and ignoring the obstacle cells
     */
    static pointToNumber(p: Point) {
        let index = 0;
        for (let x = 0; x < GUIMap.height; x++)
            for (let y = 0; y < GUIMap.width; y++) {
                if (p.x == y && p.y == x) {
                    if (GUIMap.map[y][x])
                        return -1;
                    return index;
                }
                if (!GUIMap.map[y][x])
                    index++;
            }
        throw "outside";
    }


    /**
     * 
     * @param i 
     * @returns the coordinate of the node of label i (see pointToNumber)
     */
    static numberToPoint(i: number) {
        let index = 0;
        for (let x = 0; x < GUIMap.height; x++)
            for (let y = 0; y < GUIMap.width; y++) {
                if (!GUIMap.map[y][x] && index == i)
                    return { x: y, y: x };
                if (!GUIMap.map[y][x])
                    index++;
            }

        for (let x = 0; x < GUIMap.width; x++)
            for (let y = 0; y < GUIMap.height; y++) {
                if (!GUIMap.map[x][y] && index == i) return { x: x, y: y };

                if (!GUIMap.map[x][y])
                    index++;
            }

        throw "index " + i + " is an incorrect label for node."
    }



    /**
     * 
     * @param element 
     * @param agentNumber 
     * @description apply the color for the agent number 
     */
    static setAgentColor(element: HTMLElement, agentNumber: number) {
        element.style.filter = `hue-rotate(${agentNumber * 50}deg)`;
    }


    static draggable(element: HTMLElement, callback) {
        let initPoint: Point;
        let dx = 0, dy = 0, x = 0, y = 0;
        element.ondragstart = function () { return false };
        // element.draggable = false;//it is to disable the normal "draggable"
        let map = document.getElementById("map");
        element.addEventListener("mousedown", dragMouseDown);

        let drag = true;

        function dragMouseDown(evt) {
            GUIExecution.reset();
            drag = true;
            x = evt.clientX;
            y = evt.clientY;
            map.onmousemove = elementDrag;
            map.onmouseup = closeDragElement;
            initPoint = GUIInstance.getPointFromIconPosition(element);//{ x: Math.floor(element.offsetLeft / GUIMap.zoom), y: Math.floor(element.offsetTop / GUIMap.zoom) };
            console.log(initPoint)
        }

        function elementDrag(e) {
            if (!drag) return;

            e.target.classList.add("magnetDrag");
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            dx = x - e.clientX;
            dy = y - e.clientY;
            x = e.clientX;
            y = e.clientY;

            const elX = Math.min(Math.max(0, (element.offsetLeft - dx)), GUIMap.width * GUIMap.zoom - GUIMap.zoom);
            const elY = Math.min(Math.max(0, (element.offsetTop - dy)), GUIMap.height * GUIMap.zoom - GUIMap.zoom);
            element.style.left = elX + "px";
            element.style.top = elY + "px";
        }

        function closeDragElement() {
            if (!drag)
                return;

            /*const newPoint = {
                x: Math.round((element.offsetLeft+16) / GUIMap.zoom),
                y: Math.round((element.offsetTop+32) / GUIMap.zoom)
            };*/

            const newPoint = GUIInstance.getPointFromIconPosition(element);
            console.log(newPoint)

            if (!GUIMap.map[newPoint.x][newPoint.y]) {
                GUIMap.setPosition(element, newPoint);
            }
            else {
                GUIMap.setPosition(element, initPoint);
            }

            drag = false;

            // stop moving when mouse button is released:
            map.onmouseup = null;
            map.onmousemove = null;

            callback();
        }
    }
}
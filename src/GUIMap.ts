export class GUIMap {


    static map: boolean[][]; //bitmap of the map (used like map[x][y]). True means obstacle.
    static imgObstacle = new Image(); //image of the obstacle


    static init() {
        GUIMap.imgObstacle.src = "img/obstacle.png";
    }


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
        console.log(map);
        return map;
    }

    static load(pngFileName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log("loading png")
            const img = new Image();
            img.src = "graphs/" + pngFileName;
            img.onload = () => {
                GUIMap.map = GUIMap._imgToBitMap(img);
                GUIMap.drawMap();
                resolve();
            }
        });
    }

    static drawMap() {
        const canvas = <HTMLCanvasElement>document.getElementById("background");
        canvas.width = this.width * GUIMap.zoom;
        canvas.height = this.height * GUIMap.zoom;
        for (let x = 0; x < GUIMap.width; x++)
            for (let y = 0; y < GUIMap.height; y++)
                if (GUIMap.map[x][y])
                    canvas.getContext('2d').drawImage(GUIMap.imgObstacle, x * GUIMap.zoom, y * GUIMap.zoom, 32, 32);
    }

    static setPosition(element: HTMLElement, point: Point) {
        element.style.left = point.x * GUIMap.zoom + "px";
        element.style.top = point.y * GUIMap.zoom + "px";
    }

    static get zoom(): number {
        return 32;
    }

    static get width(): number {
        return this.map.length;
    }

    static get height(): number {
        return this.map[0].length;
    }

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
    }

    static forAgentNumber(element: HTMLElement, i: number) {
        element.style.filter = `hue-rotate(${i * 50}deg)`;
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
            drag = true;
            x = evt.clientX;
            y = evt.clientY;
            map.onmousemove = elementDrag;
            map.onmouseup = closeDragElement;
            initPoint = { x: Math.floor(element.offsetLeft / GUIMap.zoom), y: Math.floor(element.offsetTop / GUIMap.zoom) };
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

            const newPoint = {
                x: Math.round(element.offsetLeft / GUIMap.zoom),
                y: Math.round(element.offsetTop / GUIMap.zoom)
            };
            console.log(newPoint)

            if (!GUIMap.map[newPoint.x][newPoint.y]) {
                element.style.left = newPoint.x * GUIMap.zoom + "px";
                element.style.top = newPoint.y * GUIMap.zoom + "px";
            }
            else {
                element.style.left = initPoint.x * GUIMap.zoom + "px";
                element.style.top = initPoint.y * GUIMap.zoom + "px";
            }

            drag = false;

            // stop moving when mouse button is released:
            map.onmouseup = null;
            map.onmousemove = null;

            callback();
        }
    }
}
export class GUIMap {
    static setPosition(element: HTMLElement, point: Point) {
        element.style.left = point.x * GUIMap.zoom + "px";
        element.style.top = point.y * GUIMap.zoom + "px";
    }

    static get zoom(): number {
        return 32;
    }


    static get width(): number {
        return (<HTMLImageElement>document.getElementById("map")).width;
    }
    static forAgentNumber(element: HTMLElement, i: number) {
        element.style.filter = `hue-rotate(${i * 50}deg)`;
    }


    static draggable(element: HTMLElement, callback) {
        let dx = 0, dy = 0, x = 0, y = 0;
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
        }

        function elementDrag(e) {
            if (!drag) return;
            console.log("drag")

            e.target.classList.add("magnetDrag");
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            dx = x - e.clientX;
            dy = y - e.clientY;
            x = e.clientX;
            y = e.clientY;

            console.log(x);
            console.log(dx);

            element.style.left = (element.offsetLeft - dx) + "px";
            element.style.top = (element.offsetTop - dy) + "px";
        }

        function closeDragElement() {
            if (!drag)
                return;
            console.log("close drag")

            element.style.left = Math.round(element.offsetLeft / GUIMap.zoom) * GUIMap.zoom + "px";
            element.style.top = Math.round(element.offsetTop / GUIMap.zoom) * GUIMap.zoom + "px";
            drag = false;

            // stop moving when mouse button is released:
            map.onmouseup = null;
            map.onmousemove = null;

            callback();
        }
    }
}
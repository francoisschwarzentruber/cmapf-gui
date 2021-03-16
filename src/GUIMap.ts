export class GUIMap {
    static setPosition(element: HTMLElement, point: Point) {
        element.style.left = point.x * GUIMap.zoom + "px";
        element.style.top = point.y * GUIMap.zoom + "px";
    }

    static get zoom(): number {
        return 32;
    }

    static get width(): number {
        return (<HTMLImageElement>document.getElementById("background")).width;
    }

    static pointToNumber(p: Point) {
        const canvas = <HTMLCanvasElement> document.getElementById("background");
        var index = 0;
        for (var x = 0; x < canvas.width / GUIMap.zoom; x++)
            for (var y = 0; y < canvas.height / GUIMap.zoom; y++){
                if (p.x == x && p.y == y)
                    return index;
                if (canvas.getContext('2d').getImageData(x, y, 1, 1).data[0] < 200) // white ??
                    index++;
            }
    }

    static forAgentNumber(element: HTMLElement, i: number) {
        element.style.filter = `hue-rotate(${i * 50}deg)`;
    }


    static draggable(element: HTMLElement, callback) {
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

            element.style.left = (element.offsetLeft - dx) + "px";
            element.style.top = (element.offsetTop - dy) + "px";
        }

        function closeDragElement() {
            if (!drag)
                return;

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
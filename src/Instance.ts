export class Instance {
    init: Point[];
    target: Point[];
    graph: string;

    toString() {
        return JSON.stringify({pngFileName: this.graph, init: this.init, target: this.target});
    }
}
import { GUIInstance } from './GUIInstance.js';

export class GUIPngFileNames {
    static init() {
        fetch("listPNGFiles.php").then((response) => {
            if (response.ok) {
                response.text().then((str) => loadListExamples(str.split('\n')));
            }
        });
    }
}


function loadListExamples(pngFileNames: string[]) {
    console.log(pngFileNames)
    let select = <any>document.getElementById("selectPNGFileName");
    select.addEventListener("change", () => { GUIInstance.load(select.value) });
  
    function addExample(exampleName) {
      const e = document.createElement("option");
      e.innerHTML = exampleName;
      e.setAttribute("value", exampleName);
      select.appendChild(e);
    }
  
    pngFileNames.filter((str) => str != "").forEach(addExample);
  
  }
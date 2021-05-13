import sys

import create_graph_from_png
import json
import subprocess

TIMEOUT = 10

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print('Error! Wrong argument count!')
        exit(1)

    init = json.loads('[' + sys.argv[1] + ']')
    target = json.loads('[' + sys.argv[2] + ']')
    radius = sys.argv[3]
    png = sys.argv[4]
    # Create grpah (physical and comm)
    create_graph_from_png.cgfpng(radius,png)

    # Create experience file
    # TODO: handle multiple file
    with open('exps/1.exp', 'w') as filehandle:
        filehandle.write('phys_graph ' + png +'_phys_uniform_grid_1_range_' + radius + ".graphml" + "\n")
        filehandle.write('comm_graph ' + png +'_comm_uniform_grid_1_range_' + radius + ".graphml" + "\n")
        filehandle.write('start')
        for i in init:
            filehandle.write(' ' + str(i))
        filehandle.write(' \n')
        filehandle.write('goal')
        for t in target:
            filehandle.write(' ' + str(t))
        filehandle.write(' \n')
    filehandle.close()
    proc = subprocess.Popen(["timeout " + str(TIMEOUT) + "s ./ccbs.out --graph-folder graphs/ --exp exps/1.exp --collisionfree false "], stdout=subprocess.PIPE, shell=True)
    (out, err) = proc.communicate()

    # Parse output for solution
    # TODO: Handling of errors
    outSplit = str(out).split("\\n")
    solution = outSplit[len(outSplit)-2].split("    ")[1]
    solution = solution.replace('{', '[')
    solution = solution.replace('}', ']')
    solution = '[' + solution + ']'
    print(solution)
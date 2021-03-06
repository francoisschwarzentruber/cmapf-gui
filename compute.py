import sys

import create_graph_from_png
import json
import subprocess


TIMEOUT = 10

# example of call
# compute.py [47,14] [55, 20] 6 map1.png



def getSolutionFromDivideAndConquerAlgorithm(init, target, physFileName, commFileName):
    pass



def getSolutionCpluplusTool(init, target, radius, png):
    createExperienceFile(init, target, radius, png)
    proc = subprocess.Popen(
        ["timeout " + str(TIMEOUT) + "s ./ccbs.out --graph-folder graphs/ --exp exps/1.exp --collisionfree false "], stdout=subprocess.PIPE, shell=True)
    (out, err) = proc.communicate()

    # Parse output for solution
    # TODO: Handling of errors
    outSplit = str(out).split("\\n")
    solution = outSplit[len(outSplit)-2].split("    ")[1]
    solution = solution.replace('{', '[')
    solution = solution.replace('}', ']')
    solution = '[' + solution + ']'
    return solution


def createExperienceFile(init, target, radius, png):  # Create experience file
    # TODO: handle multiple file
    with open('exps/1.exp', 'w') as filehandle:
        filehandle.write(
            'phys_graph ' + png + '_phys_uniform_grid_1_range_' + radius + ".graphml" + "\n")
        filehandle.write(
            'comm_graph ' + png + '_comm_uniform_grid_1_range_' + radius + ".graphml" + "\n")
        filehandle.write('start')
        for i in init:
            filehandle.write(' ' + str(i))
        filehandle.write(' \n')
        filehandle.write('goal')
        for t in target:
            filehandle.write(' ' + str(t))
        filehandle.write(' \n')
    filehandle.close()



def main(init, target, radius, png):
    physFileName, commFileName = create_graph_from_png.cgfpng(radius, png) # Create graph (physical and comm)
   # solution = getSolutionCpluplusTool(init, target, radius, png)
    solution = getSolutionFromDivideAndConquerAlgorithm(init, target, physFileName, commFileName)
    print(solution)


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print('Error! Wrong argument count!')
        exit(1)

    init = json.loads('[' + sys.argv[1] + ']')
    target = json.loads('[' + sys.argv[2] + ']')
    radius = sys.argv[3]
    png = sys.argv[4]
    main(init, target, radius, png)
   



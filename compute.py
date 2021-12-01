# example of call
# compute.py [47,14] [55, 20] 6 map1.pngFileName

# in the whole file, init is an array of initial positions, e.g. [47, 14]
# target is an array of target positions, e.g. [55, 20]
# radius = radius of communication (in pixels)
# 
#
import sys

import create_graph_from_png
import json
import subprocess

import os
# sys.path.append(os.path.normpath(os.path.join(os.getcwd(),"../L3internship_CMAPF ")))
# sys.path.append(os.path.normpath(os.path.join(os.getcwd(),"../projet/cmapf_solver ")))


TIMEOUT = 10

# example of call
# compute.py [47,14] [55, 20] 6 map1.png



def getSolutionFromDivideAndConquerAlgorithm(init, target, physFileName, commFileName):
    pass


#
# returns the solution, e.g. [ [1, 5, 4, 3], [4, 3, 2, 9]] which is a solution for two agents. The path of the first agent is [1, 5, 4, 3]. The path 
# of the second agent is [4, 3, 2, 9]
#
def getSolutionCpluplusTool(init, target, radius, pngFileName):
    createExperienceFile(init, target, radius, pngFileName)
    proc = subprocess.Popen(
        ["timeout " + str(TIMEOUT) + "s ./ccbs.out --graph-folder graphs/ --exp exps/1.exp --collisionfree false "], stdout=subprocess.PIPE, shell=True)
         #["timeout " + str(TIMEOUT) + "s ../projet/cmapf_solver/build/console_main --algo CMARRT--graph-folder graphs/ --exp exps/1.exp --collisionfree false "], stdout=subprocess.PIPE, shell=True)
    (out, err) = proc.communicate()

    # Parse output for solution
    
    try:     
        outSplit = str(out).split("\\n")
        lastLine = outSplit[len(outSplit)-2]
        solution = lastLine.split("    ")[1]
        solution = solution.replace('{', '[')
        solution = solution.replace('}', ']')
        solution = '[' + solution + ']'
        return solution
    except:
        return out


def createExperienceFile(init, target, radius, pngFileName):  # Create experience file
    # TODO: handle multiple file
    with open('exps/1.exp', 'w') as filehandle:
        filehandle.write(
            'phys_graph ' + pngFileName + '_phys_uniform_grid_1_range_' + radius + ".graphml" + "\n")
        filehandle.write(
            'comm_graph ' + pngFileName + '_comm_uniform_grid_1_range_' + radius + ".graphml" + "\n")
        filehandle.write('start')
        for i in init:
            filehandle.write(' ' + str(i))
        filehandle.write(' \n')
        filehandle.write('goal')
        for t in target:
            filehandle.write(' ' + str(t))
        filehandle.write(' \n')
    filehandle.close()



def main(init, target, radius, pngFileName):
    physFileName, commFileName = create_graph_from_png.cgfpng(radius, pngFileName) # Create graph (physical and comm)
    solution = getSolutionCpluplusTool(init, target, radius, pngFileName)
   # solution = getSolutionFromDivideAndConquerAlgorithm(init, target, physFileName, commFileName)
    print(solution)


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print('Error! Wrong argument count!')
        exit(1)

    init = json.loads('[' + sys.argv[1] + ']')
    target = json.loads('[' + sys.argv[2] + ']')
    radius = sys.argv[3]
    pngFileName = sys.argv[4]
    main(init, target, radius, pngFileName)
   



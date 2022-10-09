import argparse
from os.path import exists
import create_graph_from_png

def main(pngFileName, radius, height, density):
    # physFileName, commFileName = create_graph_from_png.cgfpng(
    #     radius,pngFileName)  # Create graph (physical and comm)
    physFileName, commFileName = create_graph_from_png.cgfpng_3d(
       radius, height, density, pngFileName)  # Create graph (physical and comm)
    print("Written graph files: " + physFileName + " and " + commFileName)
    # solution = getSolutionCpluplusTool(init, target, radius, pngFileName)
   # solution = getSolutionFromDivideAndConquerAlgorithm(init, target, physFileName, commFileName)
    # print(solution)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Given png file, produce a pair of graphml files: physical graph and communication graph (by given radius).")
    parser.add_argument("-r", "--radius", type=int, dest="radius",
                        help="communication radius",required=True)
    parser.add_argument("-f", "--inputfile", type=str, dest="inputfile",
                        help="2 or 3",required=True)
    parser.add_argument("-o", "--obstacle_density", type=int, dest="density",
                        help="1..100",required=True)
    parser.add_argument("-z", "--height", type=int, dest="height",
                        help="height",required=True)
    args = parser.parse_args()
    #assert(exists(args.inputfile))
    main(args.inputfile, args.radius, args.height, args.density)

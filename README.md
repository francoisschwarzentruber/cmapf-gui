# cmapf-gui

Graphical tool to visualize CMAPF executions.

## Installation

     git clone ....
     sudo pip3 install opencv-python
     sudo pip3 install python-igraph
     sudo pip3 install python-gflags
     sudo dnf install php
     tsc
    
Then add the program ccbs.out at the root of that folder.

## Compiling the GUI


    tsc
    
    
## To run the tool

    runlocally.sh
    
## For interfacing with the solver

Everything is explained in 

     compute.php
     
     
## Running the solver

The solver should be run as follows (without the GUI):

ccbs.out --graph-folder graphs/ --exp exps/1.exp --collisionfree false
     
## Output format

In the textbox, the output of the tool is displayed. Each line can be either a configuration or an execution (or someelse that will be ignored). Example of a configuration: <2, 3, 6> is a configuration of three agents where the first agent is at location 2, the second at 3 and the third at 6. Example of an execution: [[1, 4, 5], [2, 7, 8]] is an execution with 2 agents of length 3. The path of the first agent is 1, 4, 5. The path of the second agent is 2, 7, 8. The tool visualizes the configuration, or the execution of the current line.

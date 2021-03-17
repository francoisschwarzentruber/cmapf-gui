<?php
/*input
$_POST["init"] //of the form [1, 2, 3]
$_POST["target"] //idem
$_POST["radius"] a number
$_POST["pngFileName"] //name of the PNG file, example: myfunnymaze.png*/
// echo("[[1, 3, 5], [4, 3, 2]]");
$init = substr($_POST["init"], 1);
$init = substr($init, 0, -1);
$target = substr($_POST["target"], 1);
$target = substr($target, 0, -1);
$command = escapeshellcmd('python3 compute.py "' . $init . '" "'. $target .'" '. $_POST["radius"] .' ' . $_POST["pngFileName"] .'');
// echo $command;
$output = shell_exec($command);
// $result = "[[1,2],[1,2]]";
echo $output;

?>

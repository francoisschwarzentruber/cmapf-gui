<?php
/*input
$_POST["init"] //of the form [1, 2, 3]
$_POST["target"] //idem
$_POST["radius"] a number
$_POST["pngFileName"] //name of the PNG file, example: myfunnymaze.png*/
// echo("[[1, 3, 5], [4, 3, 2]]");

$command = escapeshellcmd('compute.py "$_POST["init"]" "$_POST["target"]" $_POST["radius"] "$_POST["pngFileName"]"');
$output = shell_exec($command);
echo $output;

?>
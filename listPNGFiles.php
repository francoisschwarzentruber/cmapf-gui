<?php
$dir    = 'graphs';
foreach (scandir($dir) as $f)
   if ($f !== '.' and $f !== '..' and strpos($f, 'graphml', 0) == false)
          echo "$f\n";
?>
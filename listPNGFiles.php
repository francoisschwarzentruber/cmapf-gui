<?php
$dir    = 'graphs';
foreach (scandir($dir) as $f)
   if ($f !== '.' and $f !== '..')
          echo "$f\n";
?>
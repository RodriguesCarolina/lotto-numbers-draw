<?php

$unluckyNumbers = [];

if ($handle = fopen('src/unluckyNumbers.json', 'r')) {
    $fileContent = '';

    while (($line = fgets($handle)) !== false) {
        $fileContent .= $line;
    }

    fclose($handle); //close the file handle. fclose and not closedir.

    $unluckyNumbers = explode(',', $fileContent);
}

header('Content-Type: application/json; charset=utf-8'); //sets the content type to json.
print json_encode($unluckyNumbers); // converts unlucky numbers into a JSON String.
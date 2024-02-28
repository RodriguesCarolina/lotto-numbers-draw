<?php

function getUnluckyNumbers() {
    $filepath = 'src/unluckyNumbers.json';

    if (file_exists($filepath)) {
        $fileContent = file_get_contents($filepath);
        $unluckyNumbers = json_decode($fileContent, true);

        if (!is_array($unluckyNumbers)) {
            $unluckyNumbers = ['unluckyNumbers' => []]; //set the json standard format
        }
    } else {
        $unluckyNumbers = ['unluckyNumbers' => []];
    }

    return $unluckyNumbers;
}

$unluckyNumbersData = getUnluckyNumbers();
header('Content-Type: application/json; charset=utf-8'); //sets the content type to json.
print json_encode($unluckyNumbersData); // converts unlucky numbers into a JSON String.
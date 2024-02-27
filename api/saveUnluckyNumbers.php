<?php

$textFile = 'src/unluckyNumbers.txt';
$inputJson = file_get_contents('php://input');
$inputDataArray = json_decode($inputJson, true);

if (!isset($inputDataArray['unluckyNumbers']) || !is_array($inputDataArray['unluckyNumbers'])) {
    http_response_code(400);
    print json_encode(['error' => 'Invalid input']);
    exit();
}

$unluckyNumbersString = implode(',', $inputDataArray['unluckyNumbers']);

$result = file_put_contents($textFile, $unluckyNumbersString);

if ($result === false) {
    http_response_code(500);
    print json_encode(['error' => 'Failed to write data to the file']);
    exit();
}

print json_encode(['success' => 'Numbers were saved']);

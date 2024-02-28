<?php

$jsonFile = 'src/unluckyNumbers.json';
$inputJson = file_get_contents('php://input');
$inputDataArray = json_decode($inputJson, true);

if (!isset($inputDataArray['unluckyNumbers']) || !is_array($inputDataArray['unluckyNumbers'])) {
    http_response_code(400);
    print json_encode(['error' => 'Invalid input']);
    exit();
}

//save a JSON object, not only an array.
$dataToSave = ['unluckyNumbers' => $inputDataArray['unluckyNumbers']];

//change this object to JSON:
$jsonData = json_encode($dataToSave, JSON_PRETTY_PRINT);
$result = file_put_contents($jsonFile, $jsonData);

if ($result === false) {
    http_response_code(500);
    print json_encode(['error' => 'Failed to write data to the file']);
    exit();
}

print json_encode(['success' => 'Numbers were saved']);

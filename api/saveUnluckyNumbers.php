<?php


$jsonFile = 'src/unluckyNumbers.json';
$inputJson = file_get_contents('php://input');
$inputDataArray = json_decode($inputJson, true);

if (!isset($inputDataArray['unluckyNumbers'])) {
    http_response_code(400);
    print json_encode(['error' => 'Invalid input']);
    exit();
}
$existingJsonData = [];

if (file_exists($jsonFile)) {
    //read file content into an array
    $fileContent = file_get_contents($jsonFile);
    $decodedContent = json_decode($fileContent, true);

    //check if the decoded content is in array
    if (is_array($decodedContent)) {
        $existingJsonData = $decodedContent;
    }
}

$mergedData = array_merge($existingJsonData, $inputDataArray['unluckyNumbers']);
$mergedDataJson = file_put_contents($jsonFile, json_encode($mergedData));

if ($mergedDataJson === false) {
    http_response_code(500);
    print json_encode(['error' => 'Failed to write data to the file']);
    exit();
}

print json_encode(['success' => 'Unlucky numbers saved successfully']);
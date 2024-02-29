<?php

$jsonFile = 'src/unluckyNumbers.json';
$inputJson = file_get_contents('php://input');
$inputDataArray = json_decode($inputJson, true);

if (!isset($inputDataArray['unluckyNumbers'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit();
}

$existingUnluckyNumbers = [];

if (file_exists($jsonFile)) {
    $fileContent = file_get_contents($jsonFile);
    $decodedContent = json_decode($fileContent, true);

    if (isset($decodedContent['unluckyNumbers']) && is_array($decodedContent['unluckyNumbers'])) {
        $existingUnluckyNumbers = $decodedContent['unluckyNumbers'];
    }
}

//add new number and save them in the existent array.
$mergedUnluckyNumbers = array_unique(array_merge($existingUnluckyNumbers, $inputDataArray['unluckyNumbers']));

// Save this merged data in a variable
$dataToSave = ['unluckyNumbers' => $mergedUnluckyNumbers];
$mergedDataJson = file_put_contents($jsonFile, json_encode($dataToSave));

if ($mergedDataJson === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write data to the file']);
    exit();
}

echo json_encode(['success' => 'Unlucky numbers saved successfully']);

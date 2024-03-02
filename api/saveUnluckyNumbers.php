<?php

$jsonFile = '../data/unluckyNumbers.json';
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

// Add new numbers and ensure that it does not exceed 6.
$allNumbers = array_merge($existingUnluckyNumbers, $inputDataArray['unluckyNumbers']);
$uniqueNumbers = array_unique($allNumbers);

//Re-index the key to make sure it will be saved as a JSON array
$uniqueNumbers = array_values($uniqueNumbers);

// If the total = 6, keep only the first 6:
if (count($uniqueNumbers) > 6) {
    $uniqueNumbers = array_slice($uniqueNumbers, 0, 6);
}

// Save the updated list of unlucky numbers.
$dataToSave = ['unluckyNumbers' => $uniqueNumbers];
$success = file_put_contents($jsonFile, json_encode($dataToSave));

if ($success === false) {
    http_response_code(500);
    print json_encode(['error' => 'Failed to write data to the file']);
    exit();
}

print json_encode(['success' => 'Unlucky numbers saved successfully']);



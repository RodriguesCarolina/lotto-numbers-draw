<?php

header('Content-Type: application/json; charset=utf-8');

$filepath = '../data/unluckyNumbers.json';
function removeUnluckyNumber($numberToRemove, $filepath) {
    // Check if the file exists and is writable to prevent file operation errors
    if (!file_exists($filepath) || !is_writable($filepath)) {
        return ['error' => 'File not found or not writable'];
    }

    // Retrieve and decode the JSON data from the file
    $jsonData = file_get_contents($filepath);
    $data = json_decode($jsonData, true);

    // Check for JSON decoding errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['error' => 'Error decoding JSON'];
    }

    // Validate the JSON structure for the expected format
    if (!isset($data['unluckyNumbers']) || !is_array($data['unluckyNumbers'])) {
        return ['error' => 'Invalid JSON structure'];
    }

    // Attempt to find and remove the number from the unlucky numbers array
    $unluckyNumbers = &$data['unluckyNumbers'];
    $key = array_search($numberToRemove, $unluckyNumbers);
    if ($key !== false) {
        unset($unluckyNumbers[$key]);
        // Re-index the array to maintain proper JSON array format after removing an element
        $unluckyNumbers = array_values($unluckyNumbers);
    } else {
        return ['error' => 'Number not found in the list'];
    }

    // Write the updated data back to the file
    if (file_put_contents($filepath, json_encode($data)) === false) {
        return ['error' => 'Error writing to file'];
    }

    return ['success' => true];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode the JSON payload from the request
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate the 'number' element in the payload
    if (isset($data['number']) && is_numeric($data['number'])) {
        $numberToRemove = intval($data['number']);
        // Remove the number using the function defined above and print the result
        $result = removeUnluckyNumber($numberToRemove, $filepath);
        print json_encode($result);
    } else {
        // Handle cases where the number is not provided or is invalid
        print json_encode(['error' => 'Number to remove not specified or invalid']);
    }
} else {
    // Respond with a 405 error if the method is not allowed (not POST)
    http_response_code(405);
    print json_encode(['error' => 'Request method not allowed']);
}

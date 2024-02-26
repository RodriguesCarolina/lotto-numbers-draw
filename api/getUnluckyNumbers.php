<?php

header('Content-Type: application/json; charset=utf-8');

$jsonFile = 'src/unluckyNumbers.json';

if (file_exists($jsonFile)) {
    $unluckyNumbers = json_decode(file_get_contents($jsonFile), true);
    echo json_encode(['unluckyNumbers' => $unluckyNumbers]);
} else {
    // If the file doesn't exist or there was an error reading it
    echo json_encode(['error' => 'Could not retrieve numbers']);
}


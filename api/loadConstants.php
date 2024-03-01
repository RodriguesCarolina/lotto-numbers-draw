<?php

$lottoConstantsFile = '../data/constants.json';

header('Content-Type: application/json');

//prüfen ob der Pfad richtig ist:
if (file_exists($lottoConstantsFile)) {
    $lottoConstants = json_decode(file_get_contents($lottoConstantsFile), true);
    print json_encode($lottoConstants);
} else {
    print json_encode(["error" => "Die Datei wurde nicht gefunden"]);;
}


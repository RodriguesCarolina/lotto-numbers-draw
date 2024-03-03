# API Documentation

## Index
1. [Get Unlucky Numbers API](#get-unlucky-numbers-api)
2. [Save Unlucky Numbers API](#save-unlucky-numbers-api)
3. [Remove Unlucky Number API](#remove-unlucky-number-api)
4. [Fetch Constants API](#fetch-constants-api)


## Get Unlucky Numbers API

The `getUnluckyNumbers.php` script functions as an API endpoint that retrieves a list of numbers considered "unlucky". These numbers are sourced from a JSON file named `unluckyNumbers.json` and are returned in a JSON format to the client. The endpoint adheres to the RESTful principle of using the `GET` method for read-only access.

### Function: `getUnluckyNumbers`

- **Purpose**: To read and return the list of unlucky numbers.
- **Operation**: Opens the `unluckyNumbers.json` file and decodes the JSON string into a PHP associative array.
- **Validation**: Checks if the resulting data structure is an array, providing an empty array as a fallback to ensure format consistency.
- **Return**: Outputs an associative array with the key `unluckyNumbers` pointing to an array of integers.

### Endpoint Details

- **HTTP Method**: `GET`
- **Endpoint**: `/api/getUnluckyNumbers.php`
- **Content-Type**: `application/json`

### Responses

#### Successful Response

- **HTTP Status Code**: `200 OK`
- **Body**:

  ```json
  {
    "unluckyNumbers": [13, 7, 26]
  }
- This response does not indicate a technical failure but informs the client that there are currently no unlucky numbers available.
# Save Unlucky Numbers API

The `saveUnluckyNumbers.php` script is an API endpoint for updating the list of unlucky numbers stored in a JSON file. The script accepts a JSON payload containing unlucky numbers, merges them with existing numbers, ensures no duplicates, and persists up to 6 unique unlucky numbers back to the file.

## Functionality

### Request Processing
- **Input**: Accepts a JSON payload with the key `unluckyNumbers` pointing to an array of numbers.
- **Validation**: Checks if the provided JSON payload has the `unluckyNumbers` key and that it is an array. Returns a `400 Bad Request` status code if validation fails.
- **Existing Numbers**: Reads the current unlucky numbers from `unluckyNumbers.json` if it exists, and combines them with the input array.
- **Unique Numbers**: Filters the combined array to ensure all numbers are unique.
- **Limitation**: Truncates the list to maintain a maximum of 6 unlucky numbers.
- **Persistence**: Saves the updated array back to `unluckyNumbers.json`.

### HTTP Method
`POST`

### Endpoint
`/api/saveUnluckyNumbers.php`

### Content-Type
`application/json`

### Request Format
```
{
  "unluckyNumbers": [number, number, ...]
}
``` 
### Responses
- **Sucessful Save:**
```
    "success": "Unlucky numbers saved successfully"
```  
- Indicates that the provided unlucky numbers were processed and saved successfully.

- **Invalid Input**
  - HTTP Status Code: 400 Bad Request
  - Body:
```
    "error": "Invalid input"
```  
- Returned when the input JSON payload does not contain the unluckyNumbers key or it is not in the expected format.

- **Server Error**
    - HTTP Status Code: 500 Internal Server Error
    - Body:
```
    "error": "Failed to write data to the file"
```  
- Indicates a server-side issue that prevented saving the data, such as file write permission.

### Example Usage
    Request: POST /api/saveUnluckyNumbers.php

- **Payload:**
```json
  {
    "unluckyNumbers": [45, 13, 7]
  }
```  
### Responses

- **Successful Response:**
```
    "success": "Unlucky numbers saved successfully"
``` 
- **Failure Response (Invalid Input):**
```
    "error": "Invalid input"
``` 

# Remove Unlucky Number API

The `removeUnluckyNumber.php` script is designed to remove a specified number from the list of unlucky numbers stored in the JSON file `unluckyNumbers.json`. This API endpoint listens for `POST` requests containing a numeric `number` parameter in the JSON payload, which represents the unlucky number to be removed.

## Functionality

### Function: `removeUnluckyNumber`
- **Purpose**: To remove a specified unlucky number from the list.
- **Parameters**:
    - `$numberToRemove`: The unlucky number to be removed.
    - `$filepath`: The path to the JSON file containing unlucky numbers.
- **File Validation**: Ensures the JSON file exists and is writable.
- **JSON Decoding**: Parses the JSON file content and validates its structure.
- **Number Removal**: Searches for the provided number and removes it if found.
- **Update File**: Saves the updated list back to the JSON file.

### Endpoint Details

- **HTTP Method**: `POST`
- **Endpoint**: `/api/removeUnluckyNumber.php`
- **Content-Type**: `application/json`

### Request Format
```
  "number": integer
```
### Responses

- **Successful Response:**

  - **HTTP Status Code**: `200 OK`
- **Body**:

  ```
    "success": true
  ``
- Indicates that the specified number was successfully removed from the list.


- **File Not Found or Not Writable**
  - **Body**:
      ```
      "error": "File not found or not writable"
      ```  
- **JSON Decoding Error**
  - **Body**:
    ```
    "error": "Error decoding JSON"
    ``` 
- **Invalid JSON Structure**
  - **Body**:
    ```
    "error": "Invalid JSON structure"error": "Invalid JSON structure
    ``` 
- **Number Not Found**
  - **Body**:
    ```
    "error": "Number not found in the list"
    ``` 
- **Error Writing to File**
    - **Body**:
      ```
      "error": ""Error writing to file"
      ``` 
  - Number to Remove Not Specified or Invalid
- 
- **Request Method Not Allowed**
    - **Body**:
      ```
      "Request method not allowed"
      ```
### Example Usage
    Request: POST /api/removeUnluckyNumber.php

- **Payload:**
    ```
    "number": 13
    ```  
### Responses

- **Successful Response:**
```
    "success": true
``` 
- **Failure Response (Number Not Found):**
```
    "error": "Number not found in the list"
``` 

# Fetch Constants API

The `loadConstants.php` endpoint is responsible for providing clients with constant values used throughout the lottery application. It retrieves these constants from a JSON file and returns them in JSON format.

## Overview

The script performs a simple file retrieval operation, where it:

- Checks for the existence of the constants file.
- Reads the file if it exists.
- Outputs the contents as JSON.

This endpoint is designed to be called with a `GET` request, as it does not modify any server state and merely returns data.

## Endpoint Details

- **HTTP Method**: `GET`
- **Endpoint**: `/api/loadConstants.php`
- **Content-Type**: `application/json`

### Responses

#### Successful Fetch

If the constants file is found and read successfully, the endpoint will return a `200 OK` status with the content of the constants file.

- **HTTP Status Code**: `200 OK`
- **Body**:

  The JSON structure containing the constants, which may look like the following example:

  ```json
  {
    "maxNumber": 59,
    "minNumber": 1,
    "numOfNumbers": 5
  }
  ``` 
- **File Not Found Error**:
- If the constants file does not exist, the endpoint will still respond with a 200 OK status but with an error message.
  ```
    "error": "Die Datei wurde nicht gefunden"
  ``` 
- This message indicates that the requested constants file could not be located.

### Example Usage
    Request: GET /api/loadConstants.php

- **Successful Response::**
```
  "maxNumber": 59,
  "minNumber": 1,
  "numOfNumbers": 5
```  

- **Failure Response (File Not Found):**
```
    "error": "Die Datei wurde nicht gefunden"
``` 
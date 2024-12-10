# Image Validation API Documentation

This API allows users to upload images and submit a prompt. It uses OpenAI's GPT model to analyze the image and determine if it meets the criteria specified in the prompt.

## Endpoint

### POST `/images/validate`

This endpoint receives an image and a prompt, processes the image, and returns whether the image meets the criteria described in the prompt.

#### Request

**URL:** `http://localhost:3000/images/validate`  
**Method:** `POST`

##### Parameters:

- **file** (required): The image to be analyzed. This should be uploaded as form-data.
- **prompt** (required): A string that describes the criteria for image analysis (e.g., detecting text, objects, etc.).

##### Request Example (cURL):

```bash
curl -X POST http://localhost:3000/images/validate \
  -F "file=@temp_image.jpg" \
  -F "prompt=Does this image contain the text 'hello'?"
```

##### Request Body:

The request should include the image as a `file` field and a `prompt` field in the form data.

- **file**: The image file you want to analyze (JPEG, PNG, GIF supported).
- **prompt**: A string that describes the image criteria to validate (e.g., "Does this image contain the text 'hello'?").

#### Response

The API returns a JSON object containing:

- **match**: A boolean indicating if the image matches the prompt criteria.
- **message**: A message explaining why the image matched or didn't match the prompt.

##### Response Example (No match):

```json
{
  "match": false,
  "message": "The image does not contain the text 'hello'."
}
```

##### Response Example (Match):

```json
{
  "match": true,
  "message": "The image contains the text 'Goodbye' as part of the design."
}
```

#### Success Response Codes:

- **200 OK**: The request was processed successfully.

#### Error Response Codes:

- **400 Bad Request**: Invalid image format or missing parameters.

#### Error Example:

```json
{
  "statusCode": 400,
  "message": "Invalid file type. Only JPEG, PNG, and GIF are allowed."
}
```

---

## Example Use Cases

### Example 1: Validating Text in Image

**Request:**

```bash
curl -X POST http://localhost:3000/images/validate \
  -F "file=@temp_image.jpg" \
  -F "prompt=Does this image contain the text 'hello'?"
```

**Response:**

```json
{
  "match": false,
  "message": "The image does not contain the text 'hello'."
}
```

### Example 2: Validating Text in Image

**Request:**

```bash
curl -X POST http://localhost:3000/images/validate \
  -F "file=@temp_image.jpg" \
  -F "prompt=Does this image contain the text 'Goodbye'?"
```

**Response:**

```json
{
  "match": true,
  "message": "The image contains the text 'Goodbye' as part of the design."
}
```

**Example Image Used:**
[https://fakeimg.pl/350x200/?text=Goodbye](https://fakeimg.pl/350x200/?text=Goodbye)

---

## API Logic Overview

1. **File Upload**: The image is uploaded via `multipart/form-data`.
2. **Prompt Handling**: The `prompt` is passed as text that describes the criteria for the image validation.
3. **Image Processing**: The image is converted to Base64 format, and its type is validated (JPEG, PNG, or GIF).
4. **OpenAI GPT Model**: The image and prompt are sent to OpenAI's GPT model for analysis.
5. **Response**: The model analyzes the image and returns a response indicating if the image matches the provided prompt.
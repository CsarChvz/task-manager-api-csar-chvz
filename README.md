
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# TaskManager API

TaskManager API is a comprehensive solution for managing tasks, comments, tags, attachments, and logs. The API is built using the NestJS framework and leverages TypeORM for database interactions.

## Getting Started

### Thunder Client 

If you prefer you can use Thunder Client, and use the files with the requests named "thunder-collection_Task Manager API - CsarChvz.json"

## Swagger Documentation

The Task Manager API provides a comprehensive Swagger UI to help you explore and interact with the API endpoints. Swagger is a powerful tool that allows you to visualize and test the API directly from your browser.

### Accessing Swagger UI

You can access the Swagger documentation and UI by navigating to the following URL in your browser:

```
http://localhost:3000/docs
```

This URL will open the Swagger interface where you can see all available endpoints, their descriptions, and the necessary parameters for each.

### Authorizing with Bearer Token

To interact with secured endpoints that require authentication, you need to provide a Bearer token. Here’s how you can set the Bearer token in Swagger:

1. **Navigate to Swagger UI**: Open your browser and go to `http://localhost:3000/docs`.

2. **Authorize with Bearer Token**:
   - Click on the **"Authorize"** button at the top right of the Swagger UI.
   - A pop-up window will appear, prompting you to enter your Bearer token.
   - Enter your token in the following format: `Bearer YOUR_JWT_TOKEN_HERE`.
   - Click **"Authorize"** and then close the pop-up window.

3. **Test Endpoints**: Now, you can make requests to the secured endpoints directly from Swagger. The Bearer token will be included in the headers of all requests.

### Using Bearer Token in Regular API Calls

When making API calls outside of Swagger (such as with Postman, Curl, or from your frontend application), you need to manually include the Bearer token in the request headers.

Here’s how you can do that:

1. **Include the Authorization Header**:
   - In your HTTP request, add a header named `Authorization`.
   - The value of this header should be in the format: `Bearer YOUR_JWT_TOKEN_HERE`.

2. **Example with Curl**:
   ```sh
   curl -X GET 'http://localhost:3000/api/tasks?page=1&limit=10' \
   -H 'Authorization: Bearer YOUR_JWT_TOKEN_HERE' \
   -H 'accept: application/json'
   ```

3. **Example with JavaScript Fetch API**:
   ```javascript
   fetch('http://localhost:3000/api/tasks?page=1&limit=10', {
     method: 'GET',
     headers: {
       'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
       'Content-Type': 'application/json'
     }
   })
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(error => console.error('Error:', error));
   ```

4. **Example with Postman**:
   - Open Postman and select the type of request (GET, POST, etc.).
   - In the request URL field, enter the endpoint URL.
   - Go to the **"Authorization"** tab.
   - Select **"Bearer Token"** from the Type dropdown.
   - Paste your JWT token in the Token field.
   - Click **"Send"** to make the request.



Follow these steps to set up and run the TaskManager API on your local machine.

### Prerequisites

- **Node.js**: Make sure you have Node.js installed. You can download it [here](https://nodejs.org/).
- **Docker**: Ensure Docker is installed on your machine for database setup. You can download Docker [here](https://www.docker.com/).
- **NestJS CLI**: Install the NestJS CLI globally if you haven't already.
  ```bash
  npm install -g @nestjs/cli
  ```

### Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/yourusername/task-manager-api.git
   cd task-manager-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Copy the environment variables file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**

   Update the variables in the `.env` file to match your local setup. Pay special attention to the database configuration.

5. **Start the database**
   ```bash
   docker-compose up -d
   ```

6. **Run the application**
   ```bash
   npm run start:dev
   ```

   The API should now be running at `http://localhost:3000`.

### API Documentation

The TaskManager API provides the following endpoints:

## Authentication

### Register User
- **URL**: `localhost:3000/api/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "Melissa",
    "email": "melissa@gmail.com",
    "password": "Password10+x"
  }
  ```
- **Response**:
  - **200 OK**: User created successfully.
  - **400 Bad Request**: Invalid input data.

### Login User
- **URL**: `localhost:3000/api/auth/login`
- **Method**: `POST`
- **Description**: Logs in an existing user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "melissa@gmail.com",
    "password": "Password10+x"
  }
  ```
- **Response**:
  - **200 OK**: Returns user data and JWT token.
  - **401 Unauthorized**: Invalid credentials.

### Check Authentication Status
- **URL**: `localhost:3000/api/auth/check-status`
- **Method**: `GET`
- **Description**: Checks the authentication status of the user.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Returns the authenticated user's information.
  - **401 Unauthorized**: Token is missing or invalid.

### Private Route Test
- **URL**: `localhost:3000/api/auth/private`
- **Method**: `GET`
- **Description**: A private route for testing authorization.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Returns user information.
  - **401 Unauthorized**: Token is missing or invalid.

## Tasks

### Get All Tasks
- **URL**: `http://localhost:3000/api/tasks`
- **Method**: `GET`
- **Description**: Retrieves a list of tasks.
- **Query Parameters**:
  - `page` (optional): Page number for pagination.
  - `limit` (optional): Number of tasks per page.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: List of tasks.
  - **401 Unauthorized**: Token is missing or invalid.

### Get Task by ID
- **URL**: `http://localhost:3000/api/tasks/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific task by its ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Task details.
  - **404 Not Found**: Task not found.
  - **401 Unauthorized**: Token is missing or invalid.

### Create Task
- **URL**: `http://localhost:3000/api/tasks`
- **Method**: `POST`
- **Description**: Creates a new task.
- **Request Body**:
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "status": "open",
    "due_date": "2024-06-14",
    "tags": [
      { "name": "Dev" },
      { "name": "Backend" }
    ]
  }
  ```
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **201 Created**: Task created successfully.
  - **400 Bad Request**: Invalid input data.
  - **401 Unauthorized**: Token is missing or invalid.

### Update Task
- **URL**: `http://localhost:3000/api/tasks/:id`
- **Method**: `PUT`
- **Description**: Updates an existing task by its ID.
- **Request Body**:
  ```json
  {
    "title": "Updated task title"
  }
  ```
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Task updated successfully.
  - **404 Not Found**: Task not found.
  - **400 Bad Request**: Invalid input data.
  - **401 Unauthorized**: Token is missing or invalid.

### Delete Task
- **URL**: `http://localhost:3000/api/tasks/:id`
- **Method**: `DELETE`
- **Description**: Deletes a task by its ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Task deleted successfully.
  - **404 Not Found**: Task not found.
  - **401 Unauthorized**: Token is missing or invalid.

### Search Tasks
- **URL**: `http://localhost:3000/api/tasks/search`
- **Method**: `GET`
- **Description**: Searches tasks based on criteria.
- **Query Parameters**:
  - `keyword` (optional): Keyword to search in title or description.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: List of tasks matching the search criteria.
  - **401 Unauthorized**: Token is missing or invalid.

### Add Tag to Task
- **URL**: `http://localhost:3000/api/tasks/:taskId/tags/:tagId`
- **Method**: `POST`
- **Description**: Adds an existing tag to a task.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **201 Created**: Tag added to task successfully.
  - **404 Not Found**: Task or Tag not found.
  - **401 Unauthorized**: Token is missing or invalid.

### Remove Tag from Task
- **URL**: `http://localhost:3000/api/tasks/:taskId/tags/:tagId`
- **Method**: `DELETE`
- **Description**: Removes an existing tag from a task.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Tag removed from task successfully.
  - **404 Not Found**: Task or Tag not found.
  - **401 Unauthorized**: Token is missing or invalid.

## Tags

### Get All Tags
- **URL**: `http://localhost:3000/api/tags`
- **Method**: `GET`
- **Description**: Retrieves a list of tags.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: List of tags.
  - **401 Unauthorized**: Token is missing or invalid.

### Get Tag by ID
- **URL**: `http://localhost:3000/api/tags/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific tag by its ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Tag details.
  - **404 Not Found**: Tag not found.
  - **401 Unauthorized**: Token is missing or invalid.

### Create Tag
- **URL**: `http://localhost:3000/api/tags`
- **Method**: `POST`
- **Description**: Creates a new tag.
- **Request Body**:
  ```json
  {
    "name": "Casa"
  }
  ```
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **201 Created**: Tag created successfully.
  - **400 Bad Request**: Invalid input data.
 

 - **401 Unauthorized**: Token is missing or invalid.

### Update Tag
- **URL**: `http://localhost:3000/api/tags/:id`
- **Method**: `PUT`
- **Description**: Updates an existing tag by its ID.
- **Request Body**:
  ```json
  {
    "name": "Casa - Modified"
  }
  ```
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Tag updated successfully.
  - **404 Not Found**: Tag not found.
  - **400 Bad Request**: Invalid input data.
  - **401 Unauthorized**: Token is missing or invalid.

### Delete Tag
- **URL**: `http://localhost:3000/api/tags/:id`
- **Method**: `DELETE`
- **Description**: Deletes a tag by its ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Tag deleted successfully.
  - **404 Not Found**: Tag not found.
  - **401 Unauthorized**: Token is missing or invalid.

## Comments

### Get All Comments
- **URL**: `http://localhost:3000/api/comments`
- **Method**: `GET`
- **Description**: Retrieves a list of comments.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: List of comments.
  - **401 Unauthorized**: Token is missing or invalid.

### Get Comment by ID
- **URL**: `http://localhost:3000/api/comments/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific comment by its ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Comment details.
  - **404 Not Found**: Comment not found.
  - **401 Unauthorized**: Token is missing or invalid.

### Create Comment
- **URL**: `http://localhost:3000/api/comments`
- **Method**: `POST`
- **Description**: Creates a new comment.
- **Request Body**:
  ```json
  {
    "content": "Este es otro comentario",
    "taskId": 26,
    "userId": 3
  }
  ```
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **201 Created**: Comment created successfully.
  - **400 Bad Request**: Invalid input data.
  - **401 Unauthorized**: Token is missing or invalid.

### Update Comment
- **URL**: `http://localhost:3000/api/comments/:id`
- **Method**: `PUT`
- **Description**: Updates an existing comment by its ID.
- **Request Body**:
  ```json
  {
    "content": "Comentario Modificado"
  }
  ```
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Comment updated successfully.
  - **404 Not Found**: Comment not found.
  - **400 Bad Request**: Invalid input data.
  - **401 Unauthorized**: Token is missing or invalid.

### Delete Comment
- **URL**: `http://localhost:3000/api/comments/:id`
- **Method**: `DELETE`
- **Description**: Deletes a comment by its ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Comment deleted successfully.
  - **404 Not Found**: Comment not found.
  - **401 Unauthorized**: Token is missing or invalid.

## Attachments

### Get All Attachments
- **URL**: `http://localhost:3000/api/attachments`
- **Method**: `GET`
- **Description**: Retrieves a list of attachments.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: List of attachments.
  - **401 Unauthorized**: Token is missing or invalid.

### Get Attachment by ID
- **URL**: `http://localhost:3000/api/attachments/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific attachment by its ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Attachment details.
  - **404 Not Found**: Attachment not found.
  - **401 Unauthorized**: Token is missing or invalid.

### Create Attachment
- **URL**: `http://localhost:3000/api/attachments`
- **Method**: `POST`
- **Description**: Uploads a new attachment.
- **Request Body**:
  ```json
  {
    "file_path": "s3://url-example",
    "file_type": "PDF",
    "taskId": 4
  }
  ```
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **201 Created**: Attachment uploaded successfully.
  - **400 Bad Request**: Invalid input data.
  - **401 Unauthorized**: Token is missing or invalid.

### Delete Attachment
- **URL**: `http://localhost:3000/api/attachments/:id`
- **Method**: `DELETE`
- **Description**: Deletes an attachment by its ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Attachment deleted successfully.
  - **404 Not Found**: Attachment not found.
  - **401 Unauthorized**: Token is missing or invalid.

## Logs

### Get All Logs
- **URL**: `http://localhost:3000/api/logs`
- **Method**: `GET`
- **Description**: Retrieves a list of logs with optional filters.
- **Query Parameters** (optional):
  - `entity_type`: Filter logs by the type of entity (e.g., `Task`, `Comment`).
  - `action_type`: Filter logs by the action type (e.g., `GET`, `CREATE`).
  - `entity_id`: Filter logs by the entity ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: List of logs.
  - **401 Unauthorized**: Token is missing or invalid.

### Get Log by ID
- **URL**: `http://localhost:3000/api/logs/:id`
- **Method**: `GET`
- **Description**: Retrieves a specific log by its ID.
- **Headers**: Authorization: Bearer `{{jwtToken}}`
- **Response**:
  - **200 OK**: Log details.
  - **404 Not Found**: Log not found.
  - **401 Unauthorized**: Token is missing or invalid.

## Conclusion

With the above endpoints and setup instructions, you should be able to run and interact with the TaskManager API effectively. Feel free to extend the API and adapt it to fit your needs. If you have any questions or run into issues, please refer to the official NestJS documentation or reach out for support.


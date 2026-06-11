# Employee-Details
A RESTful API built with Node.js, Express, MongoDB, and Mongoose for managing employee records.

## Features

- Express.js REST API
- MongoDB Database Integration
- Mongoose ODM
- Environment Variable Configuration
- Modular Route Structure
- JSON Request Handling
- Development Support with Nodemon

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- Nodemon

## Project Structure

```
project-root/
│
├── config/
│   └── db.js
│
├── routes/
│   └── employeeRoutes.js
│
├── models/
│   └── Employee.js
│
├── .env
├── .gitignore
├── Server.js
├── package.json
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/employee-details-api.git
cd employee-details-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the Application

Development Mode:

```bash
npm run dev
```

Production Mode:

```bash
npm start
```

## API Base URL

```
http://localhost:5000/api/employees
```

## Example Endpoints

### Get All Employees

```http
GET /api/employees
```

### Get Employee By ID

```http
GET /api/employees/:id
```

### Create Employee

```http
POST /api/employees
```

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

### Update Employee

```http
PUT /api/employees/:id
```

### Delete Employee

```http
DELETE /api/employees/:id
```

## Environment Variables

| Variable | Description |
|-----------|-------------|
| PORT | Server Port |
| MONGODB_URI | MongoDB Connection String |

## Scripts

```bash
npm start
```

Starts the production server.

```bash
npm run dev
```

Starts the server with Nodemon.

## Dependencies

- Express
- Mongoose
- Dotenv
- Nodemon

## Future Enhancements

- Authentication & Authorization (JWT)
- Employee Search & Filtering
- Pagination
- Validation Middleware
- API Documentation with Swagger

## License

ISC License
---
Built with using Node.js, Express, and MongoDB.

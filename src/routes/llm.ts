import { Hono } from 'hono'

const docs = new Hono()

// Markdown documentation endpoint - LLM-friendly
docs.get('/', (c) => {
  const markdown = `# Baibusu API Documentation

## Overview
API for managing insults with pagination, filtering, and sorting capabilities.

Base URL: \`/api\`

## Authentication
Protected endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <TOKEN>
\`\`\`

---

## Endpoints

### 1. Get Random Insult
**GET** \`/insults\`

Returns a single random insult from the database.

**Response (200):**
\`\`\`json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "author": "username",
  "content": "Your insult content here",
  "createdAt": "2024-01-25T10:30:00Z",
  "updatedAt": "2024-01-25T10:30:00Z"
}
\`\`\`

**Error Response (500):**
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

---

### 2. Get All Insults (Paginated)
**GET** \`/insults/list\`

Retrieve all insults with support for pagination, filtering by author, and sorting.

**Query Parameters:**
- \`page\` (optional, default: 1) - Page number (must be positive integer)
- \`limit\` (optional, default: 10) - Results per page (1-100 max)
- \`author\` (optional) - Filter by author name (case-insensitive substring match)
- \`sortBy\` (optional, default: createdAt) - Sort field: \`createdAt\`, \`author\`, or \`content\`
- \`sortOrder\` (optional, default: desc) - Sort direction: \`asc\` or \`desc\`

**Example Requests:**
\`\`\`
/insults/list
/insults/list?page=2&limit=20
/insults/list?author=john
/insults/list?sortBy=author&sortOrder=asc
/insults/list?page=1&limit=10&author=john&sortBy=createdAt&sortOrder=desc
\`\`\`

**Response (200):**
\`\`\`json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "author": "username",
      "content": "Your insult content here",
      "createdAt": "2024-01-25T10:30:00Z",
      "updatedAt": "2024-01-25T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
\`\`\`

**Error Response (400):**
\`\`\`json
{
  "error": "Invalid query parameters"
}
\`\`\`

---

### 3. Get Insult by ID
**GET** \`/insults/:id\`

Retrieve a specific insult by its UUID.

**Path Parameters:**
- \`id\` (required) - UUID of the insult

**Response (200):**
\`\`\`json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "author": "username",
  "content": "Your insult content here",
  "createdAt": "2024-01-25T10:30:00Z",
  "updatedAt": "2024-01-25T10:30:00Z"
}
\`\`\`

**Error Responses:**
- 404: Insult not found
- 400: Invalid ID format (must be valid UUID)
- 500: Internal server error

---

### 4. Create New Insult
**POST** \`/insults\`

Create a new insult (requires authentication).

**Headers:**
\`\`\`
Authorization: Bearer <TOKEN>
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "author": "username",
  "content": "Your insult content here"
}
\`\`\`

**Validation Rules:**
- \`author\` - Required, non-empty string
- \`content\` - Required, non-empty string (max 500 chars), must be unique

**Response (201):**
\`\`\`json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "author": "username",
  "content": "Your insult content here",
  "createdAt": "2024-01-25T10:30:00Z",
  "updatedAt": "2024-01-25T10:30:00Z"
}
\`\`\`

**Error Responses:**
- 201: Successfully created insult
- 401: Unauthorized (missing or invalid token)
- 400: Bad request (validation failed)
- 500: Internal server error

---

### 5. Delete Insult
**DELETE** \`/insults/:id\`

Delete a specific insult by ID (requires authentication).

**Headers:**
\`\`\`
Authorization: Bearer <TOKEN>
\`\`\`

**Path Parameters:**
- \`id\` (required) - UUID of the insult to delete

**Response (200):**
\`\`\`json
{
  "message": "Insult successfully deleted"
}
\`\`\`

**Error Responses:**
- 401: Unauthorized (missing or invalid token)
- 404: Insult not found
- 400: Invalid ID format (must be valid UUID)
- 500: Internal server error

---

## Data Types

### Insult Object
\`\`\`typescript
{
  id: string (UUID)
  author: string
  content: string
  createdAt?: string (ISO 8601 timestamp)
  updatedAt?: string (ISO 8601 timestamp)
}
\`\`\`

### Paginated Response
\`\`\`typescript
{
  data: Insult[]
  total: number (total records matching filters)
  page: number (current page)
  limit: number (results per page)
  totalPages: number (calculated from total / limit)
}
\`\`\`

---

## Common Patterns

### Filter by multiple authors
The author filter uses substring matching, so \`?author=john\` will match "john", "johnny", "Johndoe", etc.

### Pagination
Use \`totalPages\` to determine if more results exist.
- First page: \`?page=1&limit=10\`
- Next page: \`?page=2&limit=10\`
- Last page: \`?page=<totalPages>&limit=10\`

### Sorting
- Newest first: \`?sortBy=createdAt&sortOrder=desc\`
- Oldest first: \`?sortBy=createdAt&sortOrder=asc\`
- Alphabetical by author: \`?sortBy=author&sortOrder=asc\`

---

## Rate Limiting & Constraints
- Maximum limit per request: 100
- Page must be positive integer
- Author filter: case-insensitive substring match
- Content: max 500 characters, must be unique

---

## Error Handling
All errors return a consistent format:
\`\`\`json
{
  "error": "Descriptive error message"
}
\`\`\`

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (auth required)
- 404: Not Found
- 500: Internal Server Error
`

  c.header('Content-Type', 'text/markdown; charset=utf-8')
  return c.text(markdown)
})

export default docs

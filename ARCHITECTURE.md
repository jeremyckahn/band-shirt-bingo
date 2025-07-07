# Band Shirt Bingo: Project Architecture

This document outlines the full-stack architecture for the "Band Shirt Bingo" application.

## 1. Frontend (React)

The frontend is a modern, single-page application built with React.

- **Framework/Library:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Components:** [Material-UI](https://mui.com/)
- **Routing:** Client-side routing will be handled by a library like [React Router](https://reactrouter.com/) to manage navigation. The application will support dynamic routes based on band names (e.g., `/bands/metallica`).
- **API Communication:** The frontend makes asynchronous API calls to the serverless backend to fetch all necessary data.

## 2. Backend (Serverless)

The backend is built on a serverless architecture, ensuring scalability and ease of deployment.

- **Platform:** [Vercel](https://vercel.com/) will be used for hosting and managing the serverless functions.
- **API Gateway:** Vercel's infrastructure implicitly acts as the API Gateway, routing incoming HTTP requests to the appropriate serverless functions based on the file structure.
- **Serverless Functions:** The core logic resides in Node.js-based serverless functions.
  - `GET /api/bands/{bandName}`: This is the primary function. It receives a band name, checks for cached data in Redis, and on a cache miss, queries the primary database. The result is then cached before being returned to the client.
- **Database:** A serverless PostgreSQL database provided by [Neon](https://neon.tech/). This allows the database to scale with demand, matching the serverless nature of the application.
- **Caching:** A Redis instance, managed via [Vercel KV](https://vercel.com/docs/storage/vercel-kv), is used for caching. This minimizes database queries for frequently accessed bands, reducing latency and cost.

## 3. Deployment & Hosting

- **CI/CD:** The project utilizes GitHub Actions for its Continuous Integration and Continuous Deployment pipeline. The existing workflows (`ci.yml`, `deploy.yml`) handle automated linting, type-checking, building, and deploying the application.
- **Hosting Provider:** The entire stack (frontend and backend serverless functions) is hosted and deployed through **Vercel**. Vercel's integration with GitHub allows for seamless deployments on every push to the `main` branch.
- **Database Provider:** The PostgreSQL database is hosted and managed separately by **Neon**.

## 4. API Definition

The following section defines the RESTful API for the service.

### Endpoints

#### Get Band Details

- **Endpoint:** `GET /api/bands/{bandName}`
- **Description:** Retrieves the details for a specific band, including a list of 25 related bands for the bingo card.
- **Method:** `GET`

**URL Parameters:**

- `bandName` (string, required): The name of the band to look up. This should be URL-encoded by the client.
  - _Example:_ `/api/bands/Metallica`

**Responses:**

- **`200 OK`**: Successful response containing the band data.

  ```json
  {
    "id": "a4b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5",
    "name": "Metallica",
    "relatedBands": [
      { "id": "b5c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6", "name": "Slayer" },
      { "id": "c6d3e4f5-g6h7-i8j9-k0l1-m2n3o4p5q6r7", "name": "Megadeth" },
      { "id": "d7e4f5g6-h7i8-j9k0-l1m2-n3o4p5q6r7s8", "name": "Anthrax" }
      // ... 22 more related bands
    ]
  }
  ```

- **`404 Not Found`**: The requested band was not found.

  ```json
  {
    "error": "Band not found",
    "bandName": "SomeObscureBand"
  }
  ```

- **`500 Internal Server Error`**: A server-side error occurred.

### Data Models

- **`Band`**

  - `id` (string, UUID): The unique identifier for the band.
  - `name` (string): The name of the band.
  - `relatedBands` (array of `RelatedBand` objects): A list of 25 bands related to the main band.

- **`RelatedBand`**
  - `id` (string, UUID): The unique identifier for the related band.
  - `name` (string): The name of the related band.

## 5. Architecture Flow Diagram

```
                             +------------------+
                             |       User       |
                             +------------------+
                                      |
                                      v
    +-------------------------------------------------------------------------+
    | User's Browser                                                          |
    | +---------------------------------------------------------------------+ |
    | |                           React Frontend                            | |
    | +---------------------------------------------------------------------+ |
    +-------------------------------------------------------------------------+
                                      |
                                      | API Request (e.g., /api/bands/Metallica)
                                      v
    +-------------------------------------------------------------------------+
    | Vercel & Neon Platform                                                  |
    |                                                                         |
    |  +-----------------+     +---------------------+     +---------------+  |
    |  |   API Gateway   |---->| Serverless Function |<--->| Redis (Cache) |  |
    |  |    (Vercel)     |     |      (Vercel)       |     |  (Vercel KV)  |  |
    |  +-----------------+     +---------------------+     +---------------+  |
    |                                      |                     ^            |
    |                                      | (Cache Miss)        | (Populate) |
    |                                      v                     |            |
    |                                +---------------+           |            |
    |                                | Postgres (DB) |-----------+            |
    |                                |    (Neon)     |                        |
    |                                +---------------+                        |
    |                                                                         |
    +-------------------------------------------------------------------------+
```

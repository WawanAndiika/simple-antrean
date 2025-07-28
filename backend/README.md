# System Antrean Digital API

This is the backend API for a digital queueing system that handles both reservation and walk-in customers.

## Running the Project

### Prerequisites

- Docker
- Docker Compose

### Instructions

1.  Clone this repository or download the files into a directory named `backend`.
2.  Open a terminal in the `backend` directory.
3.  Run the following command:

    ```bash
    docker-compose up --build
    ```

This will start the API server on `http://localhost:3000` and the PostgreSQL database on `http://localhost:5432`.

## API Endpoints

### Queue

- **`POST /api/queue/take`**: Get a new queue number.
  - **Body**: `{"type": "R"}` for Reservation or `{"type": "W"}` for Walk-in.
  - **Success Response (201)**:
    ```json
    {
        "id": 1,
        "queue_number": "R001",
        "type": "R",
        "created_at": "2025-07-28T10:00:00.000Z",
        "status": "waiting",
        "staff_id": null
    }
    ```

- **`POST /api/queue/call`**: Call the next customer in the queue.
  - **Body**: `{"staff_id": 1}` (replace `1` with the ID of the staff member calling).
  - **Success Response (200)**:
    ```json
    {
        "id": 1,
        "queue_number": "R001",
        "type": "R",
        "created_at": "2025-07-28T10:00:00.000Z",
        "status": "called",
        "staff_id": 1
    }
    ```
  - **Error Response (404)**: If no customers are waiting.

### Dashboard

- **`GET /api/dashboard`**: Get dashboard statistics.
  - **Success Response (200)**:
    ```json
    {
        "waiting_count": 5,
        "active_staff_count": 3,
        "top_staff": [
            { "name": "Lina", "total_served": 10 },
            { "name": "Budi", "total_served": 8 },
            { "name": "Citra", "total_served": 7 }
        ]
    }
    ```

# Sistem Antrian Digital (Digital Queue Management System)

A comprehensive digital queue management system that serves both reservation and walk-in customers with a 2:1 calling scheme.

## Features

- **Dual Queue Types**: Reservation (R) and Walk-in (W) customers
- **Smart Calling Algorithm**: 2 Reservations : 1 Walk-in ratio
- **Real-time Dashboard**: Monitor queue status and staff performance
- **Audio Announcements**: Text-to-Speech notifications
- **Multi-view Interface**: Customer interface, staff panel, dashboard, and public display

## Architecture

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS (runs locally)
- **Backend**: Node.js + Express + PostgreSQL (Docker containers)
- **Deployment**: Backend via Docker Compose, Frontend via npm

## Quick Start

### Prerequisites

- Docker
- Docker Compose
- Node.js (v18 or higher)
- npm
- Git

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd system-antrean
   ```

2. **Start the backend services**
   ```bash
   docker-compose up -d
   ```

3. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Database: localhost:5432

## Application Views

### 1. Queue Taker (/) 
Customer interface to take queue numbers
- Choose between Reservation or Walk-in
- Get assigned queue number
- View current status

### 2. Staff Panel (/staff)
Staff interface to manage queue
- Select staff member
- Call next customer in queue
- Re-call same customer if needed
- Mark customers as served
- Audio announcements

### 3. Dashboard (/dashboard)
Administrative monitoring
- Real-time queue statistics
- Staff performance metrics
- Auto-refresh every 5 seconds

### 4. Display Screen (/display)
Public display for customers
- Current queue status
- Next customer information
- Queue statistics
- Auto-refresh every 3 seconds

## API Endpoints

### Queue Management
- `POST /api/queue/take` - Take a queue number
- `POST /api/queue/call` - Call next customer
- `PUT /api/queue/:id/done` - Mark customer as done

### Dashboard
- `GET /api/dashboard` - Get queue statistics

## Queue Calling Algorithm

The system implements a 2:1 reservation to walk-in calling scheme:

1. **Priority**: Reservations have higher priority
2. **Ratio**: For every 2 reservations called, 1 walk-in is called
3. **Fallback**: If no reservations are waiting, walk-ins are called
4. **Fair**: If no walk-ins are waiting, reservations continue

### Examples:
- Queue: W1, R1, R2 → Called: R1, R2, W1
- Queue: R1, W1, R2, R3, W2, R4 → Called: R1, R2, W1, R3, R4, W2

## Staff Panel Workflow

1. **Call Next**: Staff clicks "Panggil Antrian Berikutnya"
2. **Customer Called**: Shows customer info with "Panggil Lagi" and "Selesai Layani" buttons
3. **Re-call (Optional)**: Staff can click "Panggil Lagi" to announce same customer again
4. **Complete Service**: Staff clicks "Selesai Layani" to mark as done
5. **Reset**: Returns to step 1 for next customer

## Database Schema

### Tables
- `queue_entries`: Queue records with number, type, status, timestamps
- `staff`: Staff information and availability status

### Queue Status Flow
1. `waiting` → Customer in queue
2. `called` → Customer called by staff
3. `done` → Service completed

## Technology Stack

### Frontend
- Vue 3 with Composition API
- TypeScript for type safety
- Tailwind CSS for styling
- Vue Router for navigation
- Vite for development server with proxy

### Backend
- Node.js with Express.js
- PostgreSQL database
- Docker for containerization

## Configuration

### Environment Variables
The system uses the following environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment mode (development/production)

### Default Configuration
- Frontend Port: 5173 (local development)
- Backend Port: 3000
- Database Port: 5432
- Database: queue_system
- Database User: user
- Database Password: password

## Development Workflow

### Backend Development
```bash
# Start backend services
docker-compose up -d backend db

# View backend logs
docker-compose logs -f backend

# Restart backend after changes
docker-compose restart backend
```

### Frontend Development
```bash
# Install dependencies (first time)
cd frontend
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build
```

## Stopping the System

```bash
# Stop backend services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# Stop frontend (Ctrl+C in terminal where npm run dev is running)
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :5173
   lsof -i :5432
   ```

2. **Database Connection Issues**
   ```bash
   # Check if database is ready
   docker-compose logs db
   ```

3. **Frontend Build Issues**
   ```bash
   # Clear node modules and reinstall
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **API Connection Issues**
   - Ensure backend is running: `docker-compose ps`
   - Check if proxy is working in Vite config
   - Verify backend logs: `docker-compose logs backend`

### Development Tips

1. **View Logs**
   ```bash
   # Backend logs
   docker-compose logs -f backend
   
   # Database logs
   docker-compose logs -f db
   
   # All backend services
   docker-compose logs -f
   ```

2. **Database Access**
   ```bash
   # Connect to PostgreSQL
   docker-compose exec db psql -U user -d queue_system
   ```

3. **Rebuild Services**
   ```bash
   # Rebuild backend
   docker-compose up --build backend
   
   # Reset everything
   docker-compose down -v
   docker-compose up --build -d
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

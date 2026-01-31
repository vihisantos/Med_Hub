# Med Hub

SaaS platform for managing medical shifts (plantões), connecting Hospitals and Doctors.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Lucide Icons.
- **Backend**: Node.js, Express, PostgreSQL.
- **Authentication**: JWT, bcryptjs.

## Prerequisites
- Node.js (v18+)
- PostgreSQL Database

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=med_hub
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Database Setup**
   Ensure your PostgreSQL server is running and the database `med_hub` exists.
   The application will automatically create the tables on the first run.
   
   If you need to create the database manually:
   ```sql
   CREATE DATABASE med_hub;
   ```

## Running

- **Development** (Frontend + Backend):
  ```bash
  npm run dev
  ```
  Access the app at `http://localhost:5173`.

- **Build**:
  ```bash
  npm run build
  ```

## Features

- **Doctors**:
  - Register/Login.
  - View available shifts.
  - Apply for shifts.
  - Track application status.

- **Hospitals**:
  - Register/Login.
  - Post new shifts.
  - View candidates.
  - Accept/Reject applications.

## Project Structure
- `src/`: Frontend React application.
- `server/`: Backend Express application.
- `package.json`: Unified dependencies and scripts.

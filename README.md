# SlotSwapper

SlotSwapper is a peer-to-peer time-slot scheduling application that allows users to swap busy time slots with each other. Users can mark their events as "swappable," browse available slots from others, request swaps, and accept or reject incoming requests.

## Design Choices

- **Tech Stack**: Node.js/Express backend with MongoDB, React frontend.
- **Authentication**: JWT-based with password hashing (bcrypt).
- **Database**: MongoDB with Mongoose for schema modeling.
- **State Management**: React Context for auth state.
- **Styling**: Tailwind CSS for modern UI.
- **Deployment**: Docker for containerization, Vercel for frontend, Render for backend.
- **Architecture**: RESTful API with protected routes, CORS enabled.

## Local Setup and Run

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup
1. Clone the repo: `git clone <your-repo-url>`
2. `cd backend`
3. `npm install`
4. Create `.env` file:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/slotswapper
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
5. `npm start` (runs on http://localhost:5000)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
4. `npm start` (runs on http://localhost:3000)

### Testing
- Open http://localhost:3000
- Sign up, create events, test swap flow.
- Use Postman for API testing (see below).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Events (Protected)
- `GET /api/events` - Get user's events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Swaps (Protected)
- `GET /api/swaps/swappable-slots` - Get available slots
- `POST /api/swaps/swap-request` - Send swap request
- `POST /api/swaps/swap-response/:id` - Accept/reject request
- `GET /api/swaps/incoming` - Get incoming requests
- `GET /api/swaps/outgoing` - Get outgoing requests

### Postman Collection
[Public Postman Collection Link](https://www.postman.com/payload-subhasis-69761718/slotswapper-api/collection/093ps4v/slotswapper-api?action=share&creator=28196766)

All protected endpoints require `Authorization: Bearer <token>` header.
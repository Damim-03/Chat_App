# Chat App

A full-stack chat application built with React Native (Expo) frontend and Node.js/Express backend.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Real-time Chat**: Send and receive messages in real-time
- **User Management**: Profile management and user information
- **Modern UI**: Clean and responsive design with React Native
- **TypeScript**: Full TypeScript support for type safety

## Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- React Navigation
- Axios for API calls
- AsyncStorage for data persistence
- React Context for state management

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL Database
- JWT Authentication
- bcryptjs for password hashing

## Project Structure

```
Chat_App/
├── backend/                 # Backend API server
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── routes/             # API routes
│   ├── prisma/             # Database schema and migrations
│   ├── utils/              # Utility functions
│   └── src/                # Main server files
├── frontend/               # React Native app
│   ├── src/
│   │   ├── screens/        # App screens
│   │   ├── components/     # Reusable components
│   │   ├── navigation/     # Navigation setup
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── App.tsx            # Main app component
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database
- Expo CLI (for mobile development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/chat_app"
   JWT_SECRET="your-jwt-secret-key"
   PORT=5000
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - **Web**: `npm run web`
   - **Android**: `npm run android` (requires Android Studio)
   - **iOS**: `npm run ios` (requires Xcode on macOS)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Messages
- `GET /api/message/conversations` - Get user conversations
- `GET /api/message/:conversationId` - Get messages for a conversation
- `POST /api/message/send` - Send a new message
- `POST /api/message/conversation` - Create a new conversation

## Database Schema

### User
- id (String, Primary Key)
- username (String, Unique)
- fullname (String)
- password (String, Hashed)
- gender (Enum: male/female)
- profilePic (String)
- createdAt (DateTime)
- updatedAt (DateTime)

### Conversations
- id (String, Primary Key)
- createdAt (DateTime)
- updatedAt (DateTime)
- participants (User[], Many-to-Many)

### Message
- id (String, Primary Key)
- conversationId (String, Foreign Key)
- senderId (String, Foreign Key)
- body (String)
- createdAt (DateTime)
- updatedAt (DateTime)

## Development

### Running in Development Mode

1. Start the backend server:
   ```bash
   cd backend && npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend && npm start
   ```

3. Use Expo Go app on your mobile device to scan the QR code, or run on web/emulator.

### Building for Production

#### Backend
The backend is already configured for production deployment. Make sure to set proper environment variables.

#### Frontend
```bash
cd frontend
expo build:android  # For Android
expo build:ios      # For iOS
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

# EXPENSEEASE - Expense and Bill Management Tool

ExpenseEase is a comprehensive expense and bill management application that helps users track expenses, split bills with friends, and digitally store receipts and warranties. Built with a modern full-stack architecture using React on the frontend and Node.js with Express on the backend.

## Features

### 👤 Authentication
- Secure OTP-based user registration and login
- Password reset functionality via email OTP
- JWT-based session management

### 📊 Expense Tracking
- Create and categorize transactions
- Custom categories management
- Interactive dashboard with expense analytics
- Transaction history and management
- Charts and visualizations for spending patterns

### 🤝 Bill Splitting
- Create splits with friends for group expenses
- Save personal splits for future reference
- Share splits with other users
- Manage shared and saved splits

### 🗂️ Digital Vault
- Store and manage receipts digitally
- Warranty management with renewal reminders
- Image preview and upload functionality
- Tag-based organization for receipts
- QR code processing for receipt data

### 👥 Social Features
- Friend management system
- View public profiles of other users
- Social sharing of splits

### 🎨 User Interface
- Responsive design with mobile-first approach
- Modern UI using Material-UI and Tailwind CSS
- Intuitive navigation with sidebar and top navigation
- Smooth animations and transitions

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and development server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Material-UI** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **React Helmet Async** - Document head management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud storage for images
- **Nodemailer** - Email sending
- **Canvas** - Image processing
- **jsQR** - QR code processing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **MongoDB** (local installation or cloud database like MongoDB Atlas)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SandeepGKP/SpendSmart.git
   cd SpendSmart
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/ExpenseEase  # or your MongoDB Atlas URI
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Email Configuration

ExpenseEase uses Gmail for sending OTP emails. To set up:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password
3. Use your email and app password in the environment variables

### Cloudinary Setup (Optional)

For image storage functionality:
1. Create a Cloudinary account at https://cloudinary.com
2. Get your cloud name, API key, and API secret
3. Add them to the environment variables

## Running the Application

### Development Mode

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm start
   ```
   The server will run on http://localhost:3000

2. **Start the Frontend Application:**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at http://localhost:5173

### Production Build

1. **Build the Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve the Backend:**
   ```bash
   cd backend
   npm start
   ```

## API Endpoints

The backend provides the following main API endpoints:

### Authentication
- `POST /auth/signup/getotp` - Get signup OTP
- `POST /auth/signup/verifyotp` - Verify OTP and create account
- `POST /auth/signin/verifydetails` - Login
- `POST /auth/reset/getotp` - Password reset OTP

### Profile
- `GET /profile` - Get user profile
- `GET /profile/public/:userId` - View another user's public profile

### Tracking
- `POST /track/createtransaction` - Create transaction
- `GET /track/gettransactions` - Get all transactions
- `GET /track/getdashboarddata` - Dashboard analytics

### Splitting
- `POST /split/createsplit` - Create expense split
- `GET /split/getsavedsplits` - Get saved personal splits
- `GET /split/getsharedsplits` - Get shared splits
- `POST /split/share` - Share a split

### Vault
- `POST /vault/createreceipt` - Store receipt
- `POST /vault/createwarranty` - Store warranty
- `GET /vault/getreceipts` - Get all receipts
- `GET /vault/getwarranties` - Get all warranties

### Friends
- `GET /friends` - Get friends list
- Manage friend connections

## Project Structure

```
Expense-Tracker/
├── backend/               # Node.js Express server
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Custom middlewares
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── util/             # Utility functions
│   └── app.js            # Server entry point
├── frontend/              # React application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   ├── loaders/      # Route loaders
│   │   ├── UIComponents/ # UI components
│   │   └── App.jsx       # Main app component
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- Icons provided by [Flaticon](https://www.flaticon.com/)
- UI components from [Material-UI](https://mui.com/)
- Charts from [@mui/x-charts](https://mui.com/x/react-charts/)

# 📱 MobileApp

A cross-platform mobile application built with React Native (Expo) for the frontend and Django with SQLite3 for the backend. The app features robust media handling capabilities, allowing users to upload and manage images and videos with support for various formats and compression. The user management system includes secure authentication, profile customization, and role-based access control. Media files are efficiently stored and retrieved through optimized backend APIs, while user data is securely managed with proper encryption and access controls.

## ✨ Key Features

### Frontend Features

- **Cross-Platform**: Built with React Native (Expo) for iOS and Android compatibility
- **Responsive UI**: Adaptive layouts for various screen sizes and orientations

- **Media Handling**: 
  - Image and video uploads with compression
  - Media preview and playback

- **User Management**:
  - Secure authentication with JWT tokens
  - Profile customization with photo upload
  - Role-based access control

- **Real-Time Updates**: Live updates for media and user data
- **Offline Support**: Caching for improved offline experience

### Backend Features

- **RESTful API**: Clean, well-documented endpoints for all operations
- **Media Management**:
  - Efficient storage and retrieval of media files
  - Support for multiple file formats

- **User Management**:
  - Secure password hashing and storage
  - Password recovery
  - Admin dashboard for user management

- **Database**:
  - SQLite3 for development
  - PostgreSQL/MySQL support for production
  - Optimized queries for performance

- **Security**:
  - CSRF protection
  - Input validation
  - Secure file uploads

### API Features
- **Authentication**:
  - Login/Logout
  - Token-based authentication
  - Password change

- **User Management**:
  - Create/Read/Update/Delete users
  - Admin-only operations
  - Profile management

- **Media Management**:
  - Upload/Download media
  - Media metadata management
  - Search and filtering

- **Testing**:
  - Comprehensive test coverage
  - Automated API testing
  - Detailed error responses

### Development Features

- **Modular Architecture**: Clean separation of concerns
- **CI/CD Integration**: Automated testing and deployment

- **Documentation**: 
  - API documentation
  - Developer guides
  - Code comments

- **Scalability**: Designed for horizontal scaling

- **Monitoring**: 
  - Performance metrics
  - Error tracking
  - Usage analytics

## 🛠️ Technologies Used

### Frontend
- React Native
- Expo
- React Navigation
- Axios

### Backend
- Django
- Django REST Framework
- SQLite3

## 📂 Project Structure
📁 Project Structure

mobileapp/
├── frontend-js/             # React Native (Expo) frontend
│   ├── assets/              # Images, fonts, and other static assets
│   ├── components/          # Reusable UI components
│   ├── screens/             # Application screens/views
│   ├── navigation/          # Navigation configurations (e.g., React Navigation)
│   ├── services/            # API service calls and integrations
│   ├── utils/               # Utility functions and helpers
│   ├── App.js               # Entry point for the React Native app
│   ├── app.json             # Expo configuration file
│   └── package.json         # NPM dependencies and scripts
│
├── backend-django/          # Django backend
│   ├── manage.py            # Django's command-line utility
│   ├── db.sqlite3           # SQLite3 database file
│   ├── requirements.txt     # Python dependencies
│   ├── myproject/           # Django project configuration
│   │   ├── settings.py      # Project settings
│   │   ├── urls.py          # URL declarations
│   │   └── wsgi.py          # WSGI application
│   └── api/                 # Django app for API endpoints
│       ├── models.py        # Database models
│       ├── views.py         # API views
│       ├── serializers.py   # Data serialization
│       └── urls.py          # API URL routes
│
└── README.md                # Project documentation

## 🧰 Getting Started

### Prerequisites

- **Node.js 22.14.0** and **npm 10.9.2** installed
- **Python 3.13.3** and **pip 25.0.1** installed
- **Expo CLI** installed globally (`npm install -g expo-cli`)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend-django
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate.ps1
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply makemigrations & migrate:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. create superuser
   ```bash
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://127.0.0.1:8000/`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   expo start
   ```

Use the Expo Go app on your mobile device to scan the QR code and run the application.

## 🔗 API Endpoints

### Authentication
- **Login**: `POST /api/auth/login/`
- **Logout**: `POST /api/auth/logout/`
- **Change Password**: `POST /api/auth/password/change/`

### User Management
- **Get Current User Profile**: `GET /api/users/me/`
- **Update Profile**: `PUT /api/users/me/update/`
- **Get All Users**: `GET /api/users/` (Admin only)
- **Create User**: `POST /api/users/` (Admin only)
- **Get User by ID**: `GET /api/users/<id>/`
- **Update User**: `PUT /api/users/<id>/` (Admin only)
- **Delete User**: `DELETE /api/users/<id>/` (Admin only)

### Media Management
- **Get All Media**: `GET /api/media/`
- **Upload Media**: `POST /api/media/`
- **Get Media by ID**: `GET /api/media/<id>/`
- **Update Media**: `PUT /api/media/<id>/` (Owner/Admin only)
- **Delete Media**: `DELETE /api/media/<id>/` (Owner/Admin only)

## 📌 Notes

- The frontend communicates with the backend using Axios. Update the base URL in the Axios configuration to match your backend server's address.
- SQLite3 is used for local development. For production, consider switching to a more robust database like PostgreSQL.
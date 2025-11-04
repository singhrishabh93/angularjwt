# Angular JWT Authentication

A complete JWT (JSON Web Token) authentication implementation using Angular 20.

## Features

- ✅ Login component with reactive forms
- ✅ Profile component to display user data
- ✅ JWT token storage and management
- ✅ HTTP interceptor to automatically add JWT token to headers
- ✅ Login service to authenticate users
- ✅ Profile service to fetch user data with JWT token
- ✅ Route guards for protected routes
- ✅ Modern UI with responsive design

## JWT Flow

1. **Login**: User enters credentials → Login Service makes POST request → Server returns JWT token
2. **Token Storage**: Token is stored in localStorage via AuthService
3. **Header Injection**: HTTP Interceptor automatically adds `Authorization: Bearer <token>` to all requests
4. **Profile Fetch**: Profile Service makes GET request → Interceptor adds token → Server validates and returns user data
5. **Logout**: Token is removed from localStorage

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.css
│   │   └── profile/
│   │       ├── profile.component.ts
│   │       ├── profile.component.html
│   │       └── profile.component.css
│   ├── services/
│   │   ├── auth.service.ts          # Token management
│   │   ├── login.service.ts         # Login API calls
│   │   └── profile.service.ts       # Profile API calls
│   ├── interceptors/
│   │   └── auth.interceptor.ts      # Auto-add JWT headers
│   ├── app.component.ts
│   ├── app.config.ts                # App configuration with interceptor
│   └── app.routes.ts                # Routing configuration
├── main.ts
└── index.html
```

## Key Components

### AuthService (`auth.service.ts`)
- Manages JWT token storage in localStorage
- Provides methods to get, set, and remove tokens
- Decodes JWT token to extract user information

### AuthInterceptor (`auth.interceptor.ts`)
- Automatically adds `Authorization: Bearer <token>` header to all HTTP requests
- No need to manually set headers in services

### LoginService (`login.service.ts`)
- Handles user login
- Automatically stores token after successful login
- Includes both real API method and mock method for demo

### ProfileService (`profile.service.ts`)
- Fetches user profile data
- Token is automatically added by interceptor
- Includes both real API method and mock method for demo

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update API endpoints:**
   - Open `src/app/services/login.service.ts`
   - Update `apiUrl` with your actual login endpoint
   - Replace `mockLogin()` with `login()` in `login.component.ts`

   - Open `src/app/services/profile.service.ts`
   - Update `apiUrl` with your actual profile endpoint
   - Replace `mockGetProfile()` with `getProfile()` in `profile.component.ts`

3. **Run the application:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Navigate to `http://localhost:4200`
   - The app will redirect to `/login`

## Usage

### Login Flow
1. User enters email and password
2. Form validation ensures proper input
3. On submit, `LoginService.login()` is called
4. Token is automatically stored via `AuthService.setToken()`
5. User is redirected to `/profile`

### Profile Flow
1. User navigates to `/profile`
2. `ProfileComponent` checks authentication
3. `ProfileService.getProfile()` is called
4. `AuthInterceptor` automatically adds JWT token to request headers
5. Profile data is displayed

### Logout Flow
1. User clicks logout button
2. `AuthService.removeToken()` removes token from localStorage
3. User is redirected to `/login`

## API Integration

To integrate with your actual API:

1. **Login Service:**
   ```typescript
   // Replace the mockLogin() call with login()
   this.loginService.login(credentials).subscribe({...});
   ```

2. **Profile Service:**
   ```typescript
   // Replace the mockGetProfile() call with getProfile()
   this.profileService.getProfile().subscribe({...});
   ```

3. **Update API URLs:**
   - Set `apiUrl` in `login.service.ts`
   - Set `apiUrl` in `profile.service.ts`

## Demo Mode

The application includes mock methods for demonstration:
- `LoginService.mockLogin()` - Simulates login without API
- `ProfileService.mockGetProfile()` - Simulates profile fetch without API

These are used by default. Replace with actual API methods when ready.

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Token validation should be done on the backend
- Always use HTTPS in production
- Implement token refresh mechanism for production use

## Angular Version

This project uses **Angular 20** as specified.


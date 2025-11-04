# JWT Token Authentication Flow

## Complete Flow Diagram

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Navigate to /login
       ▼
┌─────────────────────┐
│  Login Component    │
│  (Reactive Form)    │
└──────┬──────────────┘
       │
       │ 2. User enters credentials
       │    Email + Password
       ▼
┌─────────────────────┐
│  Login Service      │
│  login() method     │
└──────┬──────────────┘
       │
       │ 3. POST /api/auth/login
       │    { email, password }
       ▼
┌─────────────────────┐
│  Backend API        │
│  Validates user     │
└──────┬──────────────┘
       │
       │ 4. Returns JWT Token
       │    { token: "jwt_token_here" }
       ▼
┌─────────────────────┐
│  Auth Service       │
│  setToken()         │
└──────┬──────────────┘
       │
       │ 5. Store token in localStorage
       │    localStorage.setItem('auth_token', token)
       ▼
┌─────────────────────┐
│  Router             │
│  Navigate to /profile
└──────┬──────────────┘
       │
       │ 6. Load Profile Component
       ▼
┌─────────────────────┐
│  Profile Component  │
│  ngOnInit()         │
└──────┬──────────────┘
       │
       │ 7. Check authentication
       │    AuthService.isAuthenticated()
       ▼
┌─────────────────────┐
│  Profile Service    │
│  getProfile()       │
└──────┬──────────────┘
       │
       │ 8. HTTP GET /api/user/profile
       ▼
┌─────────────────────┐
│  Auth Interceptor   │
│  authInterceptor()  │
└──────┬──────────────┘
       │
       │ 9. Get token from localStorage
       │    AuthService.getToken()
       │
       │ 10. Clone request
       │     Add Authorization header
       │     Authorization: Bearer <token>
       ▼
┌─────────────────────┐
│  HTTP Request       │
│  With JWT Header    │
└──────┬──────────────┘
       │
       │ 11. GET /api/user/profile
       │     Headers: { Authorization: Bearer <token> }
       ▼
┌─────────────────────┐
│  Backend API        │
│  Validates JWT      │
│  Returns user data  │
└──────┬──────────────┘
       │
       │ 12. Returns profile data
       │     { id, email, name, ... }
       ▼
┌─────────────────────┐
│  Profile Component  │
│  Display user data  │
└─────────────────────┘
```

## Step-by-Step Explanation

### Step 1-2: Login Form
- User navigates to `/login`
- `LoginComponent` displays reactive form
- User enters email and password
- Form validation ensures proper input

### Step 3-4: Login API Call
- User submits form
- `LoginService.login()` makes POST request to backend
- Backend validates credentials
- Backend returns JWT token if valid

### Step 5: Token Storage
- `LoginService` receives token
- Calls `AuthService.setToken(token)`
- Token stored in `localStorage` with key `'auth_token'`

### Step 6-7: Navigation & Authentication Check
- Router navigates to `/profile`
- `ProfileComponent.ngOnInit()` runs
- Checks if user is authenticated via `AuthService.isAuthenticated()`
- If not authenticated, redirects to `/login`

### Step 8: Profile API Call Initiation
- `ProfileService.getProfile()` is called
- Creates HTTP GET request to `/api/user/profile`

### Step 9-10: Interceptor Adds Token
- `authInterceptor` intercepts the HTTP request
- Gets token from `AuthService.getToken()`
- Clones the request and adds header:
  ```
  Authorization: Bearer <jwt_token>
  ```

### Step 11-12: Backend Validation & Response
- Backend receives request with JWT token
- Backend validates JWT token signature and expiration
- If valid, returns user profile data
- If invalid, returns 401 Unauthorized

### Step 13: Display Profile
- `ProfileComponent` receives profile data
- Displays user information in the UI

## Key Components

### 1. AuthService (`auth.service.ts`)
**Purpose**: Centralized token management

**Methods**:
- `setToken(token: string)` - Store token in localStorage
- `getToken()` - Retrieve token from localStorage
- `removeToken()` - Remove token on logout
- `isAuthenticated()` - Check if token exists
- `decodeToken(token: string)` - Decode JWT payload (for display)
- `getUserInfo()` - Get user info from token

### 2. AuthInterceptor (`auth.interceptor.ts`)
**Purpose**: Automatically add JWT token to all HTTP requests

**How it works**:
1. Intercepts all outgoing HTTP requests
2. Checks if token exists via `AuthService.getToken()`
3. If token exists, clones request and adds `Authorization: Bearer <token>` header
4. If no token, proceeds with original request

**Benefits**:
- No need to manually add headers in each service
- Consistent token injection across all API calls
- Centralized authentication logic

### 3. LoginService (`login.service.ts`)
**Purpose**: Handle user authentication

**Methods**:
- `login(credentials: LoginRequest)` - Real API call
- `mockLogin(credentials: LoginRequest)` - Demo method

**Flow**:
1. Receives credentials (email, password)
2. Makes POST request to login endpoint
3. On success, automatically stores token via `AuthService.setToken()`
4. Returns login response

### 4. ProfileService (`profile.service.ts`)
**Purpose**: Fetch user profile data

**Methods**:
- `getProfile()` - Real API call
- `mockGetProfile()` - Demo method

**Flow**:
1. Makes GET request to profile endpoint
2. Interceptor automatically adds JWT token to headers
3. Returns user profile data

### 5. LoginComponent (`login.component.ts`)
**Purpose**: User login interface

**Features**:
- Reactive form with validation
- Email and password fields
- Error handling
- Loading states
- Automatic redirect to profile on success

### 6. ProfileComponent (`profile.component.ts`)
**Purpose**: Display user profile

**Features**:
- Authentication check on load
- Profile data display
- Token information display (for demo)
- Logout functionality

## Headers Configuration

The interceptor automatically sets headers for all HTTP requests:

```typescript
// Before interceptor
GET /api/user/profile
Headers: {}

// After interceptor (if token exists)
GET /api/user/profile
Headers: {
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
}
```

## Token Format

JWT tokens have three parts separated by dots:
```
header.payload.signature
```

Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

- **Header**: Algorithm and token type
- **Payload**: User data (sub, name, email, iat, etc.)
- **Signature**: Verification signature

## Security Considerations

1. **Token Storage**: Currently using localStorage. For production, consider:
   - HttpOnly cookies (more secure)
   - Session storage (cleared on tab close)

2. **Token Validation**: Always validate on backend
   - Check signature
   - Check expiration
   - Check token revocation

3. **HTTPS**: Always use HTTPS in production

4. **Token Refresh**: Implement refresh token mechanism for production

5. **Token Expiration**: Handle token expiration gracefully
   - Show login prompt when token expires
   - Implement automatic token refresh

## Testing the Flow

1. **Start the app**: `npm start`
2. **Navigate to login**: `http://localhost:4200/login`
3. **Enter credentials**: Any email and password (min 6 chars)
4. **Submit form**: Token is stored automatically
5. **View profile**: Redirected to `/profile`
6. **Check headers**: Open DevTools → Network → See Authorization header
7. **Logout**: Click logout button → Token removed → Redirected to login

## Next Steps

1. Replace mock methods with real API calls
2. Update API endpoints in services
3. Add error handling for expired tokens
4. Implement token refresh mechanism
5. Add route guards for protected routes
6. Add loading indicators
7. Add proper error messages


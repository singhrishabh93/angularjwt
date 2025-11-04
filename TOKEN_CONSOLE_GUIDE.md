# How to See JWT Token in Browser Console

## Method 1: Automatic Console Logging (Easiest)

The application now automatically logs the JWT token to the console when:
- Token is stored after login
- Token is retrieved from storage
- Token is added to HTTP requests via interceptor

**Just open the browser console (F12 or Cmd+Option+I) and you'll see:**

```
✅ Login successful! Token received and stored.
📦 Login Response: {token: "...", user: {...}}
🔐 JWT Token stored: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
📋 Token decoded: {sub: "1234567890", name: "John Doe", ...}
🌐 Interceptor: Adding JWT token to request headers
📡 Request URL: /api/user/profile
🔑 Authorization Header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Method 2: Direct Browser Console Access

You can also access the token directly from the browser console:

### Option A: From localStorage

```javascript
// Get the token directly from localStorage
localStorage.getItem('auth_token')
```

### Option B: Decode the token

```javascript
// Get and decode the token
const token = localStorage.getItem('auth_token');
if (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  console.log('Decoded Token:', JSON.parse(jsonPayload));
}
```

### Option C: One-liner to see token

```javascript
// Quick one-liner to see the token
console.log('Token:', localStorage.getItem('auth_token'))
```

## Method 3: View Token in Application Tab

1. Open **DevTools** (F12 or Cmd+Option+I)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click on **Local Storage** → `http://localhost:4200`
4. Look for the key `auth_token`
5. The value is your JWT token

## Method 4: View Token in Network Tab

1. Open **DevTools** (F12 or Cmd+Option+I)
2. Go to **Network** tab
3. Make a request (e.g., navigate to profile page)
4. Click on the request
5. Go to **Headers** section
6. Look for **Request Headers**
7. Find `Authorization: Bearer <your-token>`

## Method 5: Using Angular DevTools (If Installed)

If you have Angular DevTools installed:
1. Open **DevTools**
2. Go to **Angular** tab
3. Inspect the `AuthService`
4. You can see the token in the service state

## Quick Console Commands

Copy and paste these into your browser console:

```javascript
// 1. Get token
localStorage.getItem('auth_token')

// 2. Get token and decode it
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token Payload:', payload);

// 3. Check if authenticated
localStorage.getItem('auth_token') !== null

// 4. Remove token (logout)
localStorage.removeItem('auth_token')

// 5. Pretty print token info
(function() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.log('❌ No token found');
    return;
  }
  const parts = token.split('.');
  const header = JSON.parse(atob(parts[0]));
  const payload = JSON.parse(atob(parts[1]));
  console.log('📋 Token Header:', header);
  console.log('📋 Token Payload:', payload);
  console.log('🔑 Full Token:', token);
})();
```

## What You'll See in Console

When you log in, you'll see output like this:

```
✅ Login successful! Token received and stored.
📦 Login Response: {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {id: "123", email: "demo@example.com", name: "John Doe"}
}
🔐 JWT Token stored: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
📋 Token decoded: {
  sub: "1234567890",
  name: "John Doe",
  iat: 1516239022,
  email: "demo@example.com"
}
🌐 Interceptor: Adding JWT token to request headers
📡 Request URL: https://your-api.com/api/user/profile
🔑 Authorization Header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Token Structure

A JWT token has 3 parts separated by dots:

```
header.payload.signature
```

Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6ImRlbW9AZXhhbXBsZS5jb20ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

- **Header**: Algorithm and token type
- **Payload**: User data (sub, name, email, iat, etc.)
- **Signature**: Verification signature

## Tips

1. **Keep Console Open**: The token is logged automatically when you log in
2. **Filter Console**: Use the filter in console to search for "Token" or "JWT"
3. **Preserve Log**: Check "Preserve log" in console settings to keep logs after page refresh
4. **Network Tab**: See the token in actual HTTP requests in the Network tab


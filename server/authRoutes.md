# Authentication Routes Documentation

## Email OTP Authentication

### 1. POST `/api/auth/signup/email`
**Purpose**: Initiates email signup process by sending OTP to user's email

**Input**:
```json
{
  "name": "John Doe",
  "dob": "1990-05-15",
  "email": "john@example.com"
}
```

**Output**:
```json
{
  "message": "OTP sent to your email"
}
```

**What it does**:
- Validates input data (name, dob, email)
- Checks if email is already registered
- Generates 6-digit OTP
- Stores OTP in Redis with 5-minute expiry
- Sends OTP email to user
- Returns success message

---

### 2. POST `/api/auth/verify-otp`
**Purpose**: Verifies OTP and completes signup/login process

**Input**:
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "name": "John Doe",    // Required for new users
  "dob": "1990-05-15"    // Required for new users
}
```

**Output**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "dob": "1990-05-15T00:00:00.000Z",
    "authType": "email",
    "createdAt": "2025-08-29T10:30:00.000Z",
    "updatedAt": "2025-08-29T10:30:00.000Z"
  }
}
```

**What it does**:
- Validates OTP from Redis
- If user exists: authenticates and returns JWT
- If new user: creates account with provided data
- Deletes OTP from Redis after verification
- Returns JWT token and user data

---

### 3. POST `/api/auth/resend-otp`
**Purpose**: Resends OTP to user's email if they didn't receive it

**Input**:
```json
{
  "email": "john@example.com"
}
```

**Output**:
```json
{
  "message": "OTP resent to your email"
}
```

**What it does**:
- Validates email format
- Generates new 6-digit OTP
- Updates OTP in Redis with fresh 5-minute expiry
- Sends new OTP email
- Returns success message

---

### 4. POST `/api/auth/login/email`
**Purpose**: Initiates login process for existing email users

**Input**:
```json
{
  "email": "john@example.com"
}
```

**Output**:
```json
{
  "message": "OTP sent to your email for login"
}
```

**What it does**:
- Checks if user exists with email authType
- Generates 6-digit OTP
- Stores OTP in Redis with 5-minute expiry
- Sends login OTP email
- Returns success message

---

## Google OAuth Authentication

### 5. POST `/api/auth/google/token-login`
**Purpose**: Direct Google authentication using ID token from client-side Google SDK

**Input**:
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY2ZjI...",
  "dob": "1990-05-15"  // Optional, only for first-time users
}
```

**Output**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@gmail.com",
    "authType": "google",
    "createdAt": "2025-08-29T10:30:00.000Z",
    "updatedAt": "2025-08-29T10:30:00.000Z"
  }
}
```

**What it does**:
- Verifies Google ID token with Google's servers
- Extracts user info (name, email) from verified token
- If user exists: authenticates existing Google user
- If new user: creates account with Google authType (DOB optional)
- Prevents auth method mixing (Google vs email users)
- Returns JWT token and user data

---

### 6. GET `/api/auth/google/login`
**Purpose**: Generates Google OAuth consent URL for redirect-based authentication

**Input**: None (GET request)

**Output**:
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=123...&redirect_uri=http://localhost:3000/api/auth/google/callback&scope=openid%20email%20profile&access_type=offline&prompt=consent"
}
```

**What it does**:
- Generates Google OAuth2 authorization URL
- Includes required scopes: openid, email, profile
- Sets access_type=offline to get refresh token
- Sets prompt=consent to always show consent screen
- Returns URL for frontend to redirect user to Google

---

### 7. GET `/api/auth/google/callback`
**Purpose**: Handles Google OAuth callback and completes authentication

**Input**: Query parameters from Google redirect
```
GET /api/auth/google/callback?code=4/0AWt...&scope=openid%20email%20profile
```

**Output**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@gmail.com",
    "authType": "google",
    "createdAt": "2025-08-29T10:30:00.000Z",
    "updatedAt": "2025-08-29T10:30:00.000Z"
  },
  "tokens": {
    "access_token": "ya29.a0AWY7CknfU...",
    "refresh_token": "1//04W3...",
    "id_token": "eyJhbGciOiJSUzI1NiIs..."
  }
}
```

**What it does**:
- Exchanges authorization code for Google OAuth tokens
- Verifies ID token to get user information
- If user exists: authenticates existing Google user
- If new user: creates account (requires DOB parameter for new users)
- Prevents auth method mixing
- Returns JWT token, user data, and Google tokens

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (invalid credentials)
- `404`: Not Found (route doesn't exist)
- `409`: Conflict (email already exists with different auth method)
- `500`: Internal Server Error

---

## Authentication Flow Examples

### Email Signup Flow:
1. `POST /signup/email` → User receives OTP email
2. `POST /verify-otp` → User enters OTP, account created, JWT returned

### Email Login Flow:
1. `POST /login/email` → Existing user receives OTP email  
2. `POST /verify-otp` → User enters OTP, JWT returned

### Google Direct Flow:
1. Frontend gets ID token from Google SDK
2. `POST /google/token-login` → JWT returned immediately

### Google Redirect Flow:
1. `GET /google/login` → Get Google auth URL
2. User redirected to Google, grants permission
3. `GET /google/callback` → Handle callback, JWT returned

## Security Features

- **OTP Expiry**: 5 minutes for all OTPs
- **Auth Method Isolation**: Users can't mix email and Google authentication
- **JWT Expiry**: Configurable (default 1 day)
- **Redis Storage**: Secure OTP storage with automatic cleanup
- **Google Token Verification**: All Google tokens verified with Google's servers

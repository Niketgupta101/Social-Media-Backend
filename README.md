
# User Management Module

I have used,

    For backend - Node JS, Express, Mongoose.   
    For Database - MongoDB.
    For Email Verification - Ethereal, Nodemailer.
    For token generation - jsonwebtoken (JWT).
    




### The code basically includes:

- Register, Login.
- Forgot password, reset password and register a new user with email verification.
- Update personal information.
- Fetch user with id. (with restrictions)
- Search users with information (Name, username, location etc.)

### Install dependencies for user-management-server.

```bash
    cd user-management-server
    npm install
```

### Install dependencies for email-server.

```bash
    cd email-server
    npm install
```

### Enter your details in .env file and connect to your db.

### Run the Servers.

To run user-management-server (server runs on port 5000)
```bash
    npm start
```
To run email-server (server runs on port 8000)
```bash
    npm start
```

To run Locally
```bash
    npm run server
```



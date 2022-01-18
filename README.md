
# User Management Module

I have used,

    For backend - Node JS, Express, Mongoose.   
    For Database - MongoDB.
    For Email Verification - Ethereal, Nodemailer.
    For token generation - jsonwebtoken (JWT).
    For Image Upload - Cloudinary, Multer.
    




### The code basically includes:

1. User-Management Module
- Register, Login.
- Forgot password, reset password and register a new user with email verification.
- Update personal information.
- Fetch user with id. (with restrictions)
- Search users with information (Name, username, location etc.)

2. Friends Module
- Send friend request.
- Approve/reject friend request.
- Remove friend.
- Friend Suggestions.
- Follow/Unfollow User.
- Block User.

3. Image Upload Service.
- Upload, Replace, Delete photo.

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

### Enter your details in .env file (refer .env.example) and connect to your db.

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



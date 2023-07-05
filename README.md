# MyTeams_video_chat

## Set Up the server and Run

- After Cloning the given repo, run-

- **[npm install](https://docs.npmjs.com/cli/v7/commands/npm-install)** - Install the required dependencies

- #### For setting up **Nodemailer** services:
  Create a `.env` file and add `MAIL_USERNAME`, `MAIL_PASSWORD`, `PORT` variables to it.

  1. Add the email id to be used for nodemailer as a value for `MAIL_USERNAME`.
  2. Add the generated [app password](https://youtu.be/lBRnLXwjLw0?t=983) to be used for nodemailer as a value for `MAIL_USERNAME`.
  3. Add desired port number to run the server as a value for `PORT`.

- Use `nodemon` to run the server
---
## Technology used

**Backend**: Node js , Express js

**Frontend**: HTML , CSS , JS , JQ, Bootstrap

**WebSocket**: socket.io

**WebRTC**: peerjs server and client

**Database**: MongoDB

---

## Features

### User Authentication: 
 - **Signup , Signin, Logout** - Signin stores the user session for 2 days and Logout clears the **session**.
 
 - **Authentication**- Using **Passport Local** for authenticating user and **Bcrypt** to hash the password and store it in a Mongodb database.

 - **Forgot Password**- In case user forgets his password , he may click on the forgot password and enter his e-mail and a mail would be send to his mail id using **nodemailer** containing the link to reset his password.

 - **Reset Password**- When user clicks on the link on the mail , he would be redirected to a reset password page containing the token generated using **Crypto** which would remain valid for 1 hour. Updating the password would send a confirmation link in his mail id using **nodemailer**.

 *User authentication is needed to use other features.*
 
 *Once the user is logged in he would be presented with a dashboard containing the options to **Generate a room ID for later use** or **Enter an existing room** or **start an instant meeting** .*
 
 ### Chat Room
 ***Peer js** is being used to share the Video and Audio among users in the same room.*
 
 ***uuidv4** is used to generate the room id.*
 
  - **Switch On or Off Video or Audio** - User may click on the **stop video** or **stop audio** button to switch on or off their video or audio.
 
  - **Chatting Features** - Users in the same room may chat with each other. This feature is using **Socket.io** to send and recieve messages.
 
  - **Meeting Details** - It would contain the Room ID the user is currently in.
 
  - **Leave meeting** - User may click on this button to leave the meeting and go to the home page.




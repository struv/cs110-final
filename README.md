# CS110 Final Project - Chatroom
> Authors: [William Struve](https://github.com/struv), [Isaiah Bernardino](https://github.com/isaiahpb19), [Joshua Ocharan](), [Gilbert Herrera]()

## Project Description
<!-- you can include known bugs, design decisions, external references used... -->
Working chatroom utilizing mongoDB and server-side rendering

## Features
* Google registration: users can login into the chatroom with their gmail
* Create/join chatroom: users can create a chatroom along with joining existing rooms
* Real-time messaging: users can receive and enter messages in real-time without the need to reload
* Message search: users can text search messages in a chatroom
* Mesage edit/deletion: users can delete or edit their own messages
* Profile creation: users can write a bio and change names

## Technologies used:
* Front-end: Handlebars, CSS, Javascript
* Back-end: Node.js, Express.js, Mongoose, Dotenv, Express-session, Passport, Passport Google Oauth2, Express Validator, Express Handlebars
* Database: MongoDB

## How to run
1. Clone this repository in Terminal (Mac) or Command Prompt (Windows) with the following command:
```
$ git clone https://github.com/struv/cs110-final.git
```
2. Run the following command to install all dependencies:
```
$ npm install
```
3. Create environment variables
   * In `config` directory, create file called `config.env`
   * Paste the following code in and fill in appriopiate values:
     <br/><br/>
     ```
     GOOGLE_CLIENT_ID_ENV = 
     GOOGLE_CLIENT_SECRET_ENV = 
     MONGO_URI = 
     ```
4. Start development server and connect to database:
```
$ npm run start
```
5. You should see a http link `http://...` that can be pasted into a browser


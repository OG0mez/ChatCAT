#ChatCAT - a multi-room real time chat server
1. Developed a production ready NodeJS app that allows the users to log in using Facebook or Twitter, create chatrooms of their choice and chat in real time with other users in a particular chat-room.
2. Utilized MongoDB for storing the profileID of the user along with the name and profile picture.
3. Implemented websockets using socket.io to provide chat functionality.
4. Deployed the app on the cloud with Heroku.

#Additonal Information
The App leverages the power of:
*	Express.js:- Framework for Node.js
*	Passport.js:- For providing social authentication while login using facebook or twitter
*	MongoLab.com(a MongoDB Web service):- For storing the profileID of the user along with the name and profile picture
*	Socket.io:- For creating WebSockets to implement the chat functionality
*	Winston and Morgan:- For logging mechanism
*	Redis:- For Scaling of Input/Ouput
*	Mongoose:- For providing MongoDB a schema

#Pre-requisites
1. Latest version of Node.js installed
2. Account on MongoLab.com
3. Account on Heroku.com
4. Register the App on Facebook and Twitter

#Installation
* To run the app, first install the dependencies (in package.json) with NPM.

```bash
npm install
``` 
#Deployment on Heroku
1. Write your app first
2. Download and install Heroku Toolbelt CLI
3. Login using Toolbelt
4. Create a Dyno
5. Set environment variables
6. Provision any resources like Redis
7. Push your code to the dyno using Git

#Getting started with the app
The heroku gives you the domain from where you can launch your app. Type in that domain and you are all set!
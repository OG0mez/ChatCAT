'use strict';

const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');


// Iterate through the routes object and mount the routes
    let _registerRoutes = (routes, method) => { // private functio
        for(let key in routes){
        	if(typeof routes[key] ==='object' && routes[key]!==null && !(routes[key] instanceof Array)){
        		 _registerRoutes(routes[key],key); // key = get or post
        	} else{
        		// registering the routes
        		if(method === 'get'){
        			router.get(key, routes[key]); // if key = '/', routes[key] = func whwere res.render('login')
        		} else if (method === 'post'){
        			router.get(key, routes[key]); 
        		}else{
               router.use(routes[key]);
            }

        	}
        }

    } 
   

   let route = routes => {
   	 _registerRoutes(routes);
    // console.log(router);
   	 return router;
   }

  // Find a single user based on a key
  let findOne = profileID => {
  return db.userModel.findOne({
    'profileId': profileID
     });
  }


  // Create a new user and returns that instance
let createNewUser = profile => {
  return new Promise((resolve, reject) => {
    let newChatUser = new db.userModel({
      profileId: profile.id,
      fullName: profile.displayName,
      profilePic: profile.photos[0].value || ''
    });

    newChatUser.save(error => {
      if(error) {
       // console.log("New user error");
        reject(error);
      } else {
        resolve(newChatUser);
      }
    });
  });
}

// The ES6 promisified version of findById
let findById = id => {
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if(error) {
        reject(error);
      } else {
        resolve(user); // passing the fetched user record
      }
    });
  });
}

// A middleware that checks to see if the user is authenticated & logged in
let isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) { // isAuthenticated() provided by passport and returns true if the user is logged in
    next(); // wanting the next middleware( eg: route handler) in line to execute
  } else {
    res.redirect('/');
  }
}

// Find a chatroom by a given name
let findRoomByName = (allrooms, room) => {
  let findRoom = allrooms.findIndex((element, index, array) => {
    if(element.room === room) { // element.room accesses room property of app.locals.chatrooms
      return true;
    } else {
      return false;
    }
  });
  return findRoom > -1 ? true : false; // lower case, upper case cases not included
}

// A function that generates a unique roomID
let randomHex = () => {
  return crypto.randomBytes(24).toString('hex');
}

// Find a chatroom with a given ID
let findRoomById = (allrooms, roomID) => {
  return allrooms.find((element, index, array) => {
    if(element.roomID === roomID) {
      return true;
    } else {
      return false;
    }
  });
}

// Add a user to a chatroom
let addUserToRoom = (allrooms, data, socket) => {
  // Get the room object
  let getRoom = findRoomById(allrooms, data.roomID);
  if(getRoom !== undefined) {
    // Get the active user's ID (ObjectID as used in session)
    let userID = socket.request.session.passport.user;
    // Check to see if this user already exists in the chatroom
    let checkUser = getRoom.users.findIndex((element, index, array) => {
      if(element.userID === userID) {
        return true;
      } else {
        return false;
      }
    });

    // If the user is already present in the room, remove him first
    if(checkUser > -1) {
      getRoom.users.splice(checkUser, 1);
    }

    // Push the user into the room's users array
    getRoom.users.push({
      socketID: socket.id,
      userID,
      user: data.user,
      userPic: data.userPic
    });

    // Join the room channel
    socket.join(data.roomID);

    // Return the updated room object
    return getRoom;
  }
}

// Find and purge the user when a socket disconnects
let removeUserFromRoom = (allrooms, socket) => {
  for(let room of allrooms) {
    // Find the user
    let findUser = room.users.findIndex((element, index, array) => {
      if(element.socketID === socket.id) {
        return true;
      } else {
        return false;
      }
      // return element.socketID === socket.id ? true : false
    });

    if(findUser > -1) {
      socket.leave(room.roomID); // disconnect the socket from the room channel
      room.users.splice(findUser, 1);
      return room;
    }
  }
}

   module.exports = {
   	  route, // route : route
      findOne,
      createNewUser,
      findById,
      isAuthenticated,
      findRoomByName,
      randomHex,
      findRoomById,
      addUserToRoom,
      removeUserFromRoom
   }
'use strict';
const h = require('../helpers');

module.exports = (io, app) => {
   let allrooms = app.locals.chatrooms;

/*
   allrooms.push({
   	 room: 'good food',
   	 roomID: '0001',
   	 user: [] 
   });

   allrooms.push({
   	 room: 'cloud computing',
   	 roomID: '0002',
   	 user: [] 
   });
*/
	io.of('/roomslist').on('connection', socket => { // listening to roomslist pipeline of rooms.ejs
	  //console.log("socket.io connected to client");
		socket.on('getChatrooms', () => {
			socket.emit('chatRoomsList', JSON.stringify(allrooms));
		});

		socket.on('createNewRoom', newRoomInput => {
			    // console.log(newRoomInput);
			// check to see if a room with the same title exists or not
			// if not, create one and broadcast it to everyone
			if(!h.findRoomByName(allrooms, newRoomInput)) {
				// Create a new room and broadcast to all
				allrooms.push({
					room: newRoomInput,
					roomID: h.randomHex(),
					users: []
				});

				// Emit an updated list to the creator (to that particular socket) (not to everyone connected to room page)
				socket.emit('chatRoomsList', JSON.stringify(allrooms));
				
				// Emit an updated list to everyone (all connected sockets) connected to the rooms page
				socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
			}
		});
	});

   	io.of('/chatter').on('connection', socket => {
		// Join a chatroom
		socket.on('join', data => {
			//console.log(data); // not secure
			let usersList = h.addUserToRoom(allrooms, data, socket); // socket is the active socket calling this method

			// Update the list of active users as shown on the chatrooom page
			  //console.log("User List:", usersList ); // -- getting the entire chat room object
			socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
			socket.emit('updateUsersList', JSON.stringify(usersList.users)); // for the user who just joined in
		});
    
    	  // When a socket exits
		socket.on('disconnect', () => { // "discoonect" is built in event fired by socket.io
			// Find the room, to which the socket is connected to and purge the user
			let room = h.removeUserFromRoom(allrooms, socket);
			socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
		});

		// When a new message arrives
		socket.on('newMessage', data => {
			socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
		});



	});

}
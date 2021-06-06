const express = require('express');
const app = express();
const {Server} = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const PORT = 4400;
const io = new Server(server, {
    cors: ['http://localhost:3000', 'https://resoguy.github.io']
});



let chatRooms = {
    general: [
        {id: Math.random(), username: 'Jake', message: 'Hello General!'},
        {id: Math.random(), username: 'Jane', message: 'Hello All!'},
    ],
    random: [
        {id: Math.random(), username: 'Bob', message: 'Hello Random!'},
        {id: Math.random(), username: 'John', message: 'This random chat!'},
    ],
    news: [
        {id: Math.random(), username: 'Alice', message: 'Hello News!'},
        {id: Math.random(), username: 'Kate', message: 'This news chat!'},
    ]
}

io.on('connection', (socket) => {
    console.log(`A User is connected with ID: ${socket.id}`);

    socket.emit('chat-rooms', Object.keys(chatRooms)); // ['general', 'random', 'news']

    socket.on('join-room', ({leftRoom, joinRoom}) => {
        console.log({leftRoom, joinRoom});
        const chatHistory = chatRooms[joinRoom];

        if (leftRoom) socket.leave(leftRoom)
        
        socket.join(joinRoom);
        socket.emit('update-history', chatHistory);
    })

    socket.on('message', ({room, message}) => {
        const newMessage = {
            ...message,
            id: Math.random()
        }

        const chatHistory = chatRooms[room];

        chatHistory.push(newMessage);

        io.to(room).emit('update-history', chatHistory);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected!');
    })

})

server.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
})
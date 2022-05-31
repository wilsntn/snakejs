import express from 'express'
import { Server } from "socket.io"
import http from 'http'
import game from './public/game.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('public'))

const gameInstance = game()
gameInstance.subscribe((command) => {
    io.emit(command.type, command)
})

io.on('connection', (socket) => {
    const playerId = socket.id
    gameInstance.addPlayer({playerId})

    socket.emit('state', gameInstance.state)

    socket.on('disconnect', () => {
        const playerId = socket.id
        gameInstance.removePlayer({playerId})
    })

    socket.on('playerAction', (command) => {
        if (command.playerId == socket.id) {
            gameInstance.playerAction(command)
        }
    })
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});

// setInterval(() => {
//     gameInstance.addFruit({})
// }, 10000);
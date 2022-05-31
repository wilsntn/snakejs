export default function game(playerId) {
    const state = {
        players: {},
        fruits: {},
        width: 5,
        height: 5
    }

    const currentPlayerId = playerId

    const observers = []

    function subscribe(observer) {
        observers.push(observer)
    }

    function notifyAll(command) {
        for (const observer of observers) {
            observer(command)
        }
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = command.playerX ? command.playerX : Math.floor(Math.random() * state.width)
        const playerY = command.playerY ? command.playerY : Math.floor(Math.random() * state.height)
        const playerPoints = command.playerPoints ? command.playerPoints : 0
        state.players[playerId] = { x: playerX, y: playerY, points: playerPoints }

        notifyAll({
            type: "addPlayer",
            playerId,
            playerX,
            playerY,
            playerPoints
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId
        delete state.players[playerId]

        notifyAll({
            type: "removePlayer",
            playerId
        })
    }

    function addFruit(command) {
        const fruitId = command.fruitId ? command.fruitId : Math.floor(Math.random() * 1000000000)
        const fruitX = command.fruitX ? command.fruitX : Math.floor(Math.random() * state.width)
        const fruitY = command.fruitY ? command.fruitY : Math.floor(Math.random() * state.height)
        state.fruits[fruitId] = { x: fruitX, y: fruitY }

        notifyAll({
            type: "addFruit",
            fruitId,
            fruitX,
            fruitY
        })
    }

    function removeFruit(command) {
        const fruitId = command.fruitId
        delete state.fruits[fruitId]
        
        notifyAll({
            type: "removeFruit",
            fruitId
        })
    }

    function playerAction(command) {
        if (command.playerId != currentPlayerId) {
            const availableControls = {
                'ArrowUp': (player) => {
                    player.y = player.y - 1 < 0 ? state.height - 1 : player.y - 1
                },
                'ArrowDown': (player) => {
                    player.y = player.y + 1 >= state.height ? 0 : player.y + 1
                },
                'ArrowRight': (player) => {
                    player.x = player.x + 1 >= state.width ? 0 : player.x + 1
                },
                'ArrowLeft': (player) => {
                    player.x = player.x - 1 < 0 ? state.width - 1 : player.x - 1
                }
            }

            const keyPressed = command.keyPressed
            const action = availableControls[keyPressed]

            if (action) {
                const playerId = command.playerId ? command.playerId : currentPlayerId
                const player = state.players[playerId]
                action(player)

                notifyAll({
                    type: "playerAction",
                    playerId,
                    keyPressed
                })

                checkForPlayerFruitCollision(player)
            }
        }
    }

    function checkForPlayerFruitCollision(player) {
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            if (player.x === fruit.x && player.y === fruit.y) {
                removeFruit({fruitId})
                incrementPoints(player)
            }
        }
    }

    function incrementPoints(player) {
        player.points += 1

        notifyAll({
            type: "playerPoints",
            playerId: player.id,
            playerPoints: player.points
        })
    }

    return {
        state,
        currentPlayerId,
        subscribe,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        playerAction,
    }
}
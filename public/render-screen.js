export default function updateScreen(gameInstance) {
    const arena = document.getElementById("arena")
    arena.setAttribute("width", gameInstance.state.width)
    arena.setAttribute("height", gameInstance.state.height)

    const context = arena.getContext("2d")

    renderArena(context, gameInstance)
}

function renderArena(context, gameInstance) {
    context.globalAlpha = 1.0
    context.clearRect(0, 0, gameInstance.state.width, gameInstance.state.height)

    context.globalAlpha = 0.7
    context.fillStyle = "gray"
    for (const playerId in gameInstance.state.players) {
        const player = gameInstance.state.players[playerId]
        console.log(player)
        context.fillRect(player.x, player.y, 1, 1)
    }

    context.fillStyle = "green"
    for (const fruitId in gameInstance.state.fruits) {
        const fruit = gameInstance.state.fruits[fruitId]
        console.log(fruit)
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    context.globalAlpha = 1.0
    context.fillStyle = "blue"
    const currentPlayer = gameInstance.state.players[gameInstance.currentPlayerId]
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)

    window.requestAnimationFrame(() => {
        renderArena(context, gameInstance)
    })
}
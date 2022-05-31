export default function keyboardListener() {
    const observers = []

    function subscribe(observer) {
        observers.push(observer)
    }

    function notifyAll(command) {
        for (const observer of observers) {
            observer(command)
        }
    }

    document.addEventListener('keydown', (e) => {
        notifyAll({
            type: "keyPressed",
            keyPressed: e.key
        })
    })

    return {
        subscribe
    }
}
class Logger {
    constructor(name) {
        this.name = name
    }

    getFormattedTime(date) {
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }

    info(message) {
        console.log(`[${this.name}]: ${message} - (${this.getFormattedTime(new Date())})`)
    }
}

export default Logger
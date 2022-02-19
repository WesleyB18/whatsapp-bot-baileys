import express from 'express'

class App {
    public express: express.Application

    constructor () {
      this.express = express()
      this.middlewares()
      this.routes()
    }

    private middlewares (): void {
      this.express.use(express.json())
    }

    private routes (): void {
      this.express.get('/', (request, response) => {
        response.send({ message: 'Hello World!' })
      })
    }
}

export default new App().express

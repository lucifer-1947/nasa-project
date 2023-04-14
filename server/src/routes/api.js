import launchesRouter from "./launches/launches.router.js"
import planetsRouter from "./planets/planets.router.js"
import express from 'express'

const api = express.Router()

api.use('/planets',planetsRouter)
api.use('/launches',launchesRouter)

export default api;
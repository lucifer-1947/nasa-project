import express from 'express'
import {htppGetAllLaunches, httpAbortLaunch, httpAddNewLaunch} from './launches.controller.js'

const launchesRouter = express.Router()

launchesRouter.get('/',htppGetAllLaunches)

launchesRouter.post('/',httpAddNewLaunch)

launchesRouter.delete('/:id',httpAbortLaunch)
export default launchesRouter
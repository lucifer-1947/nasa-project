import { abortLaunch, scheduleLaunch, existsLaunch, getAllLaunches } from "../../models/launches.model.js";
import getPagination from "../../services/query.js";

async function htppGetAllLaunches(req, res) {

    const { skip , limit } = getPagination(req.query)

    const launches = await getAllLaunches(skip,limit)

    return res.status(200).json(launches)
}

async function httpAddNewLaunch(req, res) {

    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) return res.status(400).json({ error: 'Missing required launch property' })

    launch.launchDate = new Date(launch.launchDate)
    if (launch.launchDate.toString() === 'Invalid Date') return res.status(400).json({ error: 'Invalid launch Date' })

    await scheduleLaunch(launch)

    return res.status(201).json(launch)

}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const exist = await existsLaunch(launchId)

    console.log(launchId)
    if (!launchId || !exist) return res.status(400).json({ error: 'Invalid Request' })

    const aborted = await abortLaunch(launchId)

    return aborted ? res.status(200).json(aborted) : res.status(400).json({ error: 'launch aborted' })
}

export { htppGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
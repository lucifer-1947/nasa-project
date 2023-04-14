import launchesDB from './launches.mongo.js'
import planetsMongo from './planets.mongo.js';
import axios from 'axios'

// const launches = new Map();

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'


async function existsLaunch(launchId) {
    return await launchesDB.findOne({ flightNumber: launchId })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB.findOne({}).sort('-flightNumber')
    if (latestLaunch) return latestLaunch.flightNumber
    else return 100;
}

async function findLaunch(filter){
    return await launchesDB.findOne(filter)
}

async function populateLaunches(){

    console.log('Downaloading Launch data from space-X...')
    
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination:false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    }
                },
                {
                    path:'payloads',
                    select:{
                        customers:1
                    }
                }
            ]
        }
    })


    if(response.status != 200){
        console.log('Problem downloading launch')
        throw new Error('Launch Data download failed')
    }

    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){

        const payloads = launchDoc.payloads
        const customers = payloads.flatMap((payload)=>{
            return payload.customers
        })

        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: new Date(launchDoc.date_local),
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
            customers,
        }

        console.log(`${launch.flightNumber} - ${launch.mission}`)

        await saveLaunch(launch)

    }

    
}

async function loadLaunchesData() {

    const firstLaunch = await findLaunch({flightNumber:1,rocket:'Falcon 1',mission:'FalconSat'})

    firstLaunch ?  console.log('SpaceX data already Downloaded') :  await populateLaunches();
    
}

async function getAllLaunches(skip,limit) {
    return await launchesDB.find({}, { '_id': 0, '__v': 0 }).sort( { flightNumber: 1 } ).skip(skip).limit(limit)
}

async function saveLaunch(launch) {

    await launchesDB.findOneAndUpdate(
        { flightNumber: launch.flightNumber },
        launch,
        { upsert: true }
    )
}


async function scheduleLaunch(launch) {

    const planet = await planetsMongo.findOne({ keplerName: launch.target })

    if (!planet) {
        throw new Error('No matching planet found')
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        upcoming: true,
        success: true,
        customers: ['Zero to Master', 'NASA'],
        flightNumber: newFlightNumber
    })
    await saveLaunch(newLaunch)

}

// function addNewLaunch(launch) {
//     latestFlightNumber++,
//         launches.set(latestFlightNumber, Object.assign(launch, {
//             upcoming: true,
//             success: true,
//             customers: ['Zero to Master', 'NASA'],
//             flightNumber: latestFlightNumber
//         }))
// }

async function abortLaunch(launchId) {
    // const aborted = launches.get(launchId)
    // aborted.upcoming = false
    // aborted.success = false

    const aborted = await launchesDB.updateOne({ flightNumber: launchId }, { upcoming: false, success: false })

    return aborted.acknowledged

}

export { loadLaunchesData, existsLaunch, getAllLaunches, scheduleLaunch, abortLaunch }

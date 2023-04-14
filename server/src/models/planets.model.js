import fs from 'fs'
import { parse } from 'csv-parse'
import planets from './planets.mongo.js'


// const habitablePlants = []

function isHabitablePlanet(planet) {
    return (planet['koi_disposition'] === 'CONFIRMED') && (planet['koi_insol'] <= 1.11) && (planet['koi_prad'] < 1.6);
}

function loadPlanetsData() {
    //you can notify that we are following FUNCTIONAL PROGRAMMING


    const relativePath = '../../data/kepler-data.csv'

    return new Promise((resolve, reject) => {
        fs
            .createReadStream(new URL(relativePath, import.meta.url))
            .pipe(parse(
                {
                    comment: '#',
                    columns: true,
                }
            ))
            .on('data', (data) => { if (isHabitablePlanet(data)) {

                // habitablePlants.push(data) ////TODO:remove comments
                savePlanet(data)   
            
            } })
            .on('error', (err) => reject(err))
            .on('end', async () => {
                // console.log(`${habitablePlants.length} habitable planets kepler mission found`)

                const countPlanetsFound =  (await getAllPlanets()).length
                console.log(`${countPlanetsFound} habitable planets kepler mission found`)

                resolve()
            })

    })
}

async function getAllPlanets(){
    // return habitablePlants
    return await planets.find({},{'_id':0,'__v':0})
}

async function savePlanet(planet){

    try{
        await planets.updateOne({
            keplerName:planet.kepler_name
        },
        {
            keplerName:planet.kepler_name
        },{
            upsert: true
        })

    }
    catch(err){
        console.error(`Could not save planet ${err}`)
    }
  
}

export { loadPlanetsData, getAllPlanets }

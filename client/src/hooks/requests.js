const origin = 'http://localhost:4000/v1'

async function httpGetPlanets() {
  // DONE: Once API is ready.
  // Load planets and return as JSON.

  const response = await fetch(`${origin}/planets`)
  const result = await response.json()
  return result
}

async function httpGetLaunches() {
  // DONE: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.

  const response = await fetch(`${origin}/launches`)
  const result = await response.json()
  return result.sort((a, b) => a.flightNumber - b.flightNumber)
}

async function httpSubmitLaunch(launch) {
  // DONE: Once API is ready.
  // Submit given launch data to launch system.

  try {

    return await fetch(`${origin}/launches`, {
      method: "POST",
      body: JSON.stringify(launch),
      headers: {
        'Content-Type': 'application/json',
      }
    })


  }
  catch (err) { 
    return { ok: false } 
  }

}

async function httpAbortLaunch(id) {
  // DONE: Once API is ready.
  // Delete launch with given ID.

  try {

    return await fetch(`${origin}/launches/${id}`, {
      method: "DELETE"
    })


  }
  catch (err) { 
    return { ok: false } 
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
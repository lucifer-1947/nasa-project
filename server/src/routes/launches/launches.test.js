import request from 'supertest'
import app from '../../app.js'
import { json } from 'express'
import {mongoConfig,mongoDisconnect} from '../../services/mongo.js'

describe('All tests', () => {

    beforeAll(async ()=>{
        await mongoConfig()
    })

    describe('Test Get /v1/launches', () => {

        test('it should respond with 200 success', async () => {

            const response = await request(app).get('/v1/launches')

            expect(response.statusCode).toBe(200)
        })
    })

    describe('Test Post /v1/launch', () => {

        const completeLaunchData = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer IS1',
            launchDate: 'January 4, 2030',
            target: 'Kepler-442 b',
        }

        const launchDataWithoutDate = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer IS1',
            target: 'Kepler-442 b',
        }

        const invalidLaunchData = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer IS1',
            launchDate: 'FUCKOFFFFFFFFFFFFFF🖕🏻',
            target: 'Kepler-442 b',
        }



        test('it should respond with 201 created', async () => {

            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201)

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(responseDate).toBe(requestDate)
            expect(response.body).toMatchObject(launchDataWithoutDate)
        })


        test('it should catch missing required properties', async () => {

            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({ error: 'Missing required launch property' })
        })

        test('it should catch invalid dates', async () => {

            const response = await request(app)
                .post('/v1/launches')
                .send(invalidLaunchData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({ error: 'Invalid launch Date' })

        })
    })

    afterAll(async ()=>{
        await mongoDisconnect()
    })
})


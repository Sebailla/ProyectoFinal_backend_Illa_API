import supertest from 'supertest'
import { logger } from '../src/utils/logger.js'
import { expect } from 'chai'

const request = supertest('http://localhost:8080')

describe('Testing User', () => {

    describe('Test Login', async () => {

        it('El endpoint /api/login/login debe poder loguear un usuario ya registrado previamente', async () => {
            const user = {
                email: 'seba.illa.prueba@gmail.com',
                password: 'Agoilla1'
            }
            const result = await request.post('/api/login/login').send(user)

            logger.info(`statusCode: ${result.statusCode}`)
            logger.info(`User Login: ${result._body.user.email}`)
            
            expect(result.statusCode).to.equal(200)
        })

        it('El endpoint /api/login/register debe poder registrar un usuario nuevo', async () => {
            const user = {
                firstName: 'Juan',
                lastName: 'Perez',
                age: '23',
                email: 'prueba_0@prueba.com',
                password: '12345678'
            }
            const result = await request.post('/api/login/register').send(user)
            
            logger.info(`statusCode: ${result.statusCode}`)
            logger.info(`Created User: ${result._body.user.email}`)
            
            expect(result.statusCode).to.equal(200)
            expect(result._body.user).to.have.property('_id')
        })
    })
})


// npx mocha src/test/user.test.js
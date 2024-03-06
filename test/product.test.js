import { expect } from 'chai'
import supertest from 'supertest'
import { logger } from '../src/utils/logger.js'

const request = supertest('http://localhost:8080')

describe('Teste Ecommerce', () => {
    describe('Teste de Productos', () => {

        it('el Endpoint /api/products debe mostrar todos los productos', async () => {

            const result = await request.get('/api/products')

            logger.info(`statusCode: ${result.statusCode}`)

            expect(result.statusCode).to.equal(200)
        })

        it('El endpoint /api/products/:id debe poder buscar un producto por _id', async () => {

            const pid = '6558f1cff388575a4f86933a';
            const result = await request.get(`/api/products/${pid}`)

            logger.info(`statusCode: ${result.statusCode}`)
            logger.info(`pid: ${result._body.result._id}`)

            expect(result.statusCode).to.equal(200);
            expect(result._body.result._id).to.eq(pid);
        })

        it('El endpoint /api/products debe poder crear un producto nuevo para un usurio autenticado previamente', async () => {

            const user = {
                email: 'seba.illa.prueba@gmail.com',
                password: 'Agoilla1'
            }

            const login = await request.post('/api/login/login').send(user)

            const token = login._body.token

            const product = {
                title: 'Producto 1',
                description: 'Este es un producto de prueba',
                code: 'prod1',
                price: 230,
                stock: 25,
                category: 'Prueba',
                status: true
            }

            const result = await request.post('/api/products')
                .set('token', token)
                .send(product)

            logger.info(`statusCode: ${result.statusCode}`)
            logger.info(`msg: ${result._body.msg}`)

            expect(result.statusCode).to.equal(200);
            expect(result._body.result).to.have.property('_id')
        })

        it('El endpoint /api/products/:pid debe poder eliminar un producto creado previamente para un usurio autenticado', async () => {

            const user = {
                email: 'seba.illa.prueba@gmail.com',
                password: 'Agoilla1'
            }

            const login = await request.post('/api/login/login').send(user)

            const token = login._body.token

            const product = {
                title: 'Producto 2',
                description: 'Este es un producto de prueba para eliminar',
                code: 'prod2',
                price: 230,
                stock: 25,
                category: 'Prueba',
                status: true
            }

            const result = await request.post('/api/products')
                .set('token', token)
                .send(product)

            const pid = result._body.result._id

            const deleteProd = await request.delete(`/api/products/${pid}`)
                .set('token', token)

            logger.info(`statusCode: ${result.statusCode}`)
            logger.info(`msg: ${result._body.msg}`)
            logger.info(`msg: ${deleteProd._body.msg}`)

            expect(result.statusCode).to.equal(200);
            expect(deleteProd.statusCode).to.equal(200)
        })
    })
})
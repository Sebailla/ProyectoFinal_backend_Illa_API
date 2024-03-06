import { expect } from 'chai'
import supertest from 'supertest'
import { logger } from '../src/utils/logger.js'

const request = supertest('http://localhost:8080')

describe('Teste Ecommerce', () => {
    describe('Teste de Carrito', () => {

        it('El endpoint /api/carts/:cid debe poder mostrar el carrito de un usuario registrado', async () => {

            const user = {
                email: 'seba.illa.prueba@gmail.com',
                password: 'Agoilla1'
            }

            const login = await request.post('/api/login/login').send(user)

            const token = login._body.token

            const cid = login._body.user.cart_id

            const result = await request.get(`/api/carts/${cid}`)
                .set('token', token)

            logger.info(`statusCode: ${result.statusCode}`)
            logger.info(`Cart: ${result._body.result._id}`)
            expect(result.statusCode).to.equal(200);
            expect(result._body.result).to.have.property('_id')
        })

        it('El endpoint /api/carts/:cid/products/:pid debe poder agregar un producto al carrito de un usuario registrado', async () => {

            const user = {
                email: 'seba.illa.prueba@gmail.com',
                password: 'Agoilla1'
            }

            const login = await request.post('/api/login/login').send(user)

            const token = login._body.token

            const cid = login._body.user.cart_id
            const pid = '6558f1cff388575a4f86933a'

            const result = await request.post(`/api/carts/${cid}/products/${pid}`)
                .set('token', token)

            expect(result.statusCode).to.equal(200);
            expect(result._body.result).to.have.property('_id')

            logger.info(`statusCode: ${result.statusCode}`)
        })

        it('El endpoint /api/carts/:cid/products/:pid debe poder eliminar un producto del carrito de un usuario registrado', async () => {

            const user = {
                email: 'seba.illa.prueba@gmail.com',
                password: 'Agoilla1'
            }

            const login = await request.post('/api/login/login').send(user)

            const token = login._body.token
            const cid = login._body.user.cart_id
            const pid = '6558f1cff388575a4f86933a'

            const result = await request.post(`/api/carts/${cid}/products/${pid}`)
                .set('token', token)

            const deleteResult = await request.delete(`/api/carts/${cid}/products/${pid}`)
                .set('token', token)


            expect(result.statusCode).to.equal(200);
            expect(result._body.result).to.have.property('_id')
            expect(deleteResult.statusCode).to.equal(200);

            logger.info(`statusCode Producto agregado al Carrito: ${result.statusCode}`)
            logger.info(`statusCode Producto eliminado del Carrito: ${deleteResult.statusCode}`)
        })
    })
})




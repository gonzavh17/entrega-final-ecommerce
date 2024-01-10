// Dependencies
import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import logger from "../../src/utils/loggers.js";
import 'dotenv/config';

const expect = chai.expect;
const requester = supertest(process.env.APP_URL + process.env.APP_PORT);

await mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => logger.info('Conectado a la BDD Mongo (test mode)'))
    .catch(error => logger.error('Error al conectar a la BDD Mongo (test mode): ' + error));


const getProductID = async () => {
    const response = await requester.get('/api/products')

    //Retrieve first product ID of the list
    const _id = response.body.message.docs[0]._id
    return _id
}

describe('Test de Usuario y carrito', function () {
    logger.info("Iniciando test de usuario y carrito");
    this.timeout(15000);

    let token = {}
    let cartId = ""
    let userId = ""
    const newUser = {
        "first_name": "Panchito",
        "last_name": "Perez",
        "email": process.env.TESTING_EMAIL,
        "password": process.env.TESTING_PASSWORD,
        "age": 24
    }

    it("Ruta: api/session/register para crear usuario", async () => {
        const response = await requester.post('/api/session/register').send(newUser)
        const { status } = response

        expect(status).to.equal(200)
    })

    it("Ruta: api/session/login con el metodo POST", async () => {
        const response = await requester.post('/api/session/login')
            .send({
                email: newUser.email,
                password: newUser.password
            });

        const __body = response.body.payload
        const tokenResult = response.headers['set-cookie'][0];

        expect(tokenResult).to.be.ok
        expect(response.status).to.be.equal(200)

        token = {
            name: tokenResult.split("=")[0],
            value: tokenResult.split("=")[1]
        }

        expect(token.value).to.be.ok
        expect(token.name).to.be.ok.and.equal('jwtCookie')
        expect(__body.cart).to.be.ok

        userId = __body._id
        cartId = __body.cart
    })

    it('Ruta: api/carts/product/pid con metodo POST', async () => {
        const cid = cartId
        const pid = await getProductID();
        const quantity = 1

        /* await requester.post(`/api/carts/products/${pid}`).set('Cookie', [`${token.name} = ${token.value}`]) AGREGAR DOS VECES EL MISMO PRODUCTO*/

        const response = await requester
            .post(`/api/carts/${cid}/product/${pid}`)
            .set('Cookie', `${token.name}=${token.value}`)
            .send({ quantity });
        const { status } = response

        expect(status).to.equal(200)
    })

    it('Ruta: api/carts/cid/product/pid Metodo PUT', async () => {
        const cid = cartId
        const pid = await getProductID();
        const newQuantity = { quantity: 6 }

        const response = await requester.put(`/api/carts/${cid}/product/${pid}`).send(newQuantity).set('Cookie', [`${token.name} = ${token.value}`])
        const { status } = response

        expect(status).to.equal(200)
    })

    it('Ruta: api/users/uid metodo DELETE', async () => {
        const uid = userId
        const { status } = await requester.delete(`/api/users/${uid}`).set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)
    })
})
import {faker} from '@faker-js/faker'

const generateRandomProducts = async (req, res) => {
    try {

        const products = []

        for(let i = 0; i < 100; i++) {
            const productData = {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                stock: faker.number.int({ min: 5, max: 40 }),
                category: faker.commerce.department(),
                status: true,
                code: faker.string.alphanumeric(10),
                thumbnails: [faker.image.url()]
            }

            products.push(productData);
        }

        res.json({message: 'Productos creados exitosamente', products})
    } catch (error) {
        res.status(500).send({error: error.message})
    }
}

const mockingController = {
    generateRandomProducts
}

export default mockingController
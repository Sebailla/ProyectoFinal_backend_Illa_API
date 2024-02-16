import { faker } from "@faker-js/faker"

export const mokingProducts = async (req = request, res = response) => {
    try {
        faker.location = 'es'
        const products = Array.from({length: 100}, (_, index) => ({
            _id: faker.string.uuid(),
            title: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            code: (index + 1).toString(),
            price: faker.number.int({min:1,max:1000}),
            status: faker.datatype.boolean(),
            stock: faker.number.int({min:1,max:100}),
            category: faker.commerce.department(),
            thumbnail: faker.image.url()
        }))

        return res.json({products})
    } catch (error) {
        logger.error(`Error en moking-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}
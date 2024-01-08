import { __dirname } from "../path.js";
import swaggerJSDoc from "swagger-jsdoc"

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Tienda Online - API Docs',
            description: 'Official documentation for the Online Store API',
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

export const specs = swaggerJSDoc(swaggerOptions)
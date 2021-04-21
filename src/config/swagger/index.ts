export const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MAM Challenge Backend',
            version: '1.0.0'
        },
    },
    apis: ['./?(src|server)/config/swagger/swagger.yaml', './?(src|server)/routers/**/*.yaml']
}

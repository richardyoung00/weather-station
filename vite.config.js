export default {
    root: "ui",
    server: {
        port: 3001,
        proxy: {
            '/socket.io': {
                target: 'http://localhost:3000/',
                ws: true,
            }
        },
    },


}
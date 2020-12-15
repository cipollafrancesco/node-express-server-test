const http = require('http')

// REQUEST LISTENER
const app = require('./app')

// SETTING UP SERVER PORT
const port = process.env.PORT || 8080

// SERVER INSTANCE
const server = http.createServer(app)

// SERVER START
server.listen(port, () => console.log('Server listening on http://localhost:' + port)   )
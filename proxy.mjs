import * as net from 'node:net'
const PORTENTRADA = 1234
const PORTDESTINO = 8080
const server = net.createServer()

server.listen(PORTENTRADA, () => {
  // const { port } = server.address()
  console.log(`Proxy esperando conexiòn en localhost:${PORTENTRADA} y resuelve en destino localhost:${PORTDESTINO}`)
})
server.on('error', (err) => {
  console.log('Error:', err.name, err.message)
})
server.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.remoteAddress}::${socket.remotePort}`)
  socket.on('data', d => {
    d = d.toString()
    console.log('Requerimiento de entrada al Proxy recibida')
    console.log('------------------------------------------\n', d)
    const destino = net.createConnection({ port: PORTDESTINO }, () => {
      // 'connect' listener.
      console.log('Conectado a Server final')
      destino.write(`${d}\r\n`)
    })
    destino.on('error', (err) => {
      console.log('Error de conexion al destino final PORT:', PORTDESTINO, err.message)
    })
    destino.on('data', d => {
      d = d.toString()
      destino.end()
      console.log('Data recibida desde el destino final en el proxy')
      console.log('------------------------------------------------\n', d)
      socket._write(d, 'utf-8', (err) => {
        console.log('Error de escritura en socket .... ', err.message)
      })
    })
  })
})

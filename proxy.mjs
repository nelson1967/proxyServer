import * as net from 'node:net'
const PORTENTRADA = process.env.PORTENTRADA ?? 1234
const PORTDESTINO = process.env.PORTDESTINO ?? 4004
const SRVDESTINO = process.env.SRVDESTINO ?? 'localhost'
const server = net.createServer()

server.listen(PORTENTRADA, () => {
  // const { port } = server.address()
  console.log(`Proxy esperando conexión en http://localhost:${PORTENTRADA}/ y resolviendo peticiones hacia destino http://${SRVDESTINO}:${PORTDESTINO}/`)
})
server.on('error', (err) => {
  console.log('Error:', err.name, err.message)
})
server.on('connection', (socket) => {
  console.log(`Request del cliente conectado: ${socket.remoteAddress}::${socket.remotePort}`)
  socket.on('data', d => {
    // d = d.toString()
    const finLinea = d.indexOf(Buffer.from('\n'))
    const requerimiento = d.subarray(0, finLinea).toString()
    console.log('Requerimiento de entrada al Proxy recibida:')
    console.log('\tBytes leidos  :', socket.bytesRead)
    console.log('\tBytes escritos: ', socket.bytesWritten)
    console.log('\tRemote Address:', socket.remoteAddress)
    console.log('\tRemote Port   :', socket.remotePort)
    console.log('---------------------------------------------------------')
    // console.log(requerimiento)
    console.log(d.toString())
    console.log('---------------------------------------------------------')
    // console.log('------------------------------------------\n', d.toString())
    if (requerimiento.includes('POST') || requerimiento.includes('GET')) {
      // console.log('GET/POST al servidore final (full request)...:\n', d.toString())
      console.log('GET/POST al servidore final (full request)...')
      if (requerimiento.includes('correo=')) {
        requerimiento.replace('correo=', 'email=')
      }
    }
    let muestraRespuesta = false
    if (d.includes('.js')) muestraRespuesta = true
    const destino = net.createConnection(PORTDESTINO, SRVDESTINO, () => {
      // 'connect' listener.
      console.log('Enviando request a Server final:', SRVDESTINO)
      destino.write(`${d}\r\n`)
    })
    destino.on('error', (err) => {
      console.log(`Error de conexion al destino final PORT: ${PORTDESTINO} con error: ${err.message}`)
    })
    destino.on('data', d => {
      // d = d.toString()
      destino.end()
      console.log('Respuesta recibida desde el servidor destino: ', SRVDESTINO)
      // const isBinary = /[^\x20-\x7E]/.test(d) // Prueba de caracteres no imprimibles
      if (!muestraRespuesta) {
        console.log('Data desde el servidor viene con carácteres no imprimibles')
      } else {
        console.log('Data desde el servidor parece ser imprimible')
        // console.log('--------------------------------------------')
        // console.log(d.toString())
      }
      // console.log('Data recibida desde el destino final en el proxy')
      // console.log('----------- Enviando al cliente ----------------\n')
      socket.write(d, 'utf8', () => {
        console.log('Data enviada al cliente ...')
        socket.destroy()
      })
    })
  })
})

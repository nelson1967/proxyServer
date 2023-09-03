const prompt = '>'
const bienvenida = `Bienvenida(o) al prompt 0.0.1\n${prompt}`
process.stdout.write(bienvenida)
process.stdin.on('data', function (data) {
  const linea = data.toString().substring(0, data.length - 1)
  console.log('Comando leido: ', linea.substring(0, data.length - 1))
  if (linea === 'exit') {
    process.exit(0)
  }
  process.stdout.write(prompt)
})
process.stdin.resume()

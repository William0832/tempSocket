const express = require('express')
const skio = require('socket.io')
const app = express()
const port = process.env.PROT || 3000
app.use(express.static('public'))

const server = app.listen(port,() => {
  console.log(`App is listen on http://localhost:${port}`)
})

const io = skio(server)
io.on('connection',(socket) => {
  console.log('A user connected')
  
  socket.on('disconnect', () => {
    console.log(' user disconnected')
  })

  socket.on('chat msg', (payload)=>{
    let {msg, name} = payload
    
    console.log(`${name}: ${msg}`)

    socket.emit('chat msg',payload)
  })
})


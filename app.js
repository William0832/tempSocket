const express = require('express')
const skio = require('socket.io')
const five = require('johnny-five')

const app = express()
const  {Board, Led} = five
const board = new Board({port: 'COM5'})
const port = process.env.PROT || 3000

app.use(express.static('public'))

const server = app.listen(port,() => {
  console.log(`App is listen on http://localhost:${port}`)
})

const io = skio(server)
board.on('ready', ()=>{
  const led = new Led(13)
  led.off()
  io.on('connection', (socket)=>{
    console.log('A user connected')

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })

    socket.on('switchLED', payload => {
      let { isOn } = payload
      console.log('switchLED',payload)
      if(isOn) led.on()
      else led.off()
      io.emit('switchLED', payload)
    })

    socket.on('chat msg', (payload) => {
      let {msg, name} = payload
      console.log('===================')
      console.log(`${name}: ${msg}`)
      // 回全部 user
      io.emit('chat msg',payload)
    })

  })
})



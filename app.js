const express = require('express')
const skio = require('socket.io')

const app = express()
const port = process.env.PROT || 3000

app.use(express.static('public'))

const server = app.listen(port,() => {
  console.log(`App is listen on http://localhost:${port}`)
})
const users = {}
const io = skio(server)
  io.on('connection', (socket)=>{
    let id = socket.id
    users[id] = {
      name: '',
    }
    console.log(`A user ${id} connected`)
    console.log(users)

    socket.on('disconnect', () => {
      let {id} = socket
      console.log(`A user ${id} disconnected`)
      io.emit('userDisconnect',{
        msg: '有使用者離線了'
      })
      delete users[id]
      console.log(users)
    })


    socket.on('chat msg', (payload) => {
      let {id} = socket
      let {msg, name} = payload
      console.log('===================')
      users[id].name = name
      console.log(`${name}: ${msg}`)
      // 回全部 user
      io.emit('chat msg', payload)
      console.log(users)
    })

  })
// })



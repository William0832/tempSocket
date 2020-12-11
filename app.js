const express = require('express')
const skio = require('socket.io')

const app = express()
const port = process.env.PROT || 3000

app.use(express.static('public'))

const server = app.listen(port,() => {
  console.log(`App is listen on http://localhost:${port}`)
})

const users = {
  listObj: {},
  count: 0
}
const checkName = (name) =>{
  if(name === 'Server') return false
  let names = Object.values(users.listObj).map(e => e.name)
  if (names.includes(name)) return false
  return true
}

const io = skio(server)
io.on('connection', (socket)=>{
  let id = socket.id
  users.count += 1
  let name = `Guest-${id.slice(0,3)}`
  socket.emit('update name',{name})
  users.listObj[id] = { name }
  console.log(`A user ${id} connected`)
  io.emit('update users', {users})
  io.emit('userConnected', { msg: `${name} 上線了`})

  socket.on('disconnect', () => {
    let {id} = socket
    console.log(`A user ${id} disconnected`)
    let { name } = users.listObj[id]
    delete users.listObj[id]
    users.count -= 1
    io.emit('userDisconnect',{ msg: `${name} 離線了`})
    io.emit('update users', {users})
  })

  socket.on('chat msg', (payload) => {
    let {id} = socket
    let {name} = payload
    let isSameName = name === users.listObj[id].name
    if(!isSameName && !checkName(name)) {
      socket.emit('name check', { isOK: false })
      return
    }
    socket.emit('name check', {isOK: true })
    users.listObj[id].name = name
    // 更新其他人的 msg
    socket.broadcast.emit('chat msg', payload)
    // 更新其他人的 users 
    socket.broadcast.emit('update users', {users})
  })

})



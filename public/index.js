let socket = io ()
const btn = document.getElementById('submit')
const nameEl = document.getElementById('user-name')
const msgEl= document.getElementById('input-text')
const msgWrapper = document.getElementById('msgs')

const views = {
  addMsg({selector, name, msg}){
    let node = document.createElement('LI')
    node.innerText = `${name}: ${msg}`
    document.getElementById(selector).appendChild(node)
  }
}
const submitHandler = () => {
    let msg = msgEl.value
    let name = nameEl.value
    socket.emit('chat msg', {name, msg})
    msgEl.value = ''
}

socket.on('userDisconnect', (payload)=>{
  payload.selector = 'msgs'
  payload.name = 'Server'
  views.addMsg(payload)
})

socket.on('chat msg',(payload) => {  
  payload.selector = 'msgs'
  views.addMsg(payload)
})

btn.addEventListener('click', submitHandler)


let socket = io ()
const btn = document.getElementById('submit')
const nameEl = document.getElementById('user-name')
const msgEl= document.getElementById('input-text')
const msgWrapper = document.getElementById('msgs')
const submitHandler = (e) => {
    // console.log('name:', nameEl.value)
    // console.log('msg:', msgEl.value)
    let msg = msgEl.value
    let name = nameEl.value
    socket.emit('chat msg', {name, msg})
}
socket.on('chat msg',(payload)=>{
  let {name, msg} = payload
  console.log(name,msg)
  let node = document.createElement('LI')
  node.innerText = `${name}: ${msg}`
  msgWrapper.appendChild(node)

})
btn.addEventListener('click', submitHandler)
let socket = io ()
const btn = document.getElementById('submit')
const nameEl = document.getElementById('user-name')
const msgEl= document.getElementById('input-text')
const msgWrapper = document.getElementById('msgs')
const switcher = document.getElementById('switcher')

switcher.querySelector('.custom-control-input')
  .addEventListener('click',(e) => {
    let {checked} = e.target
    let ledState = checked ? 'ON' : 'OFF'
    switcher.querySelector('.custom-control-label').innerText = `LED ${ledState}`
    socket.emit('switchLED', { isOn: checked })
  })

socket.on('switchLED', (payload)=>{
  let {isOn} = payload
  let ledState = isOn ? 'ON' : 'OFF'
  switcher.querySelector('.custom-control-label').innerText = `LED ${ledState}`
  switcher.querySelector('.custom-control-input').checked = isOn 
})

const submitHandler = (e) => {
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

let socket = io()
const btn = document.getElementById('submit')
const nameEl = document.getElementById('user-name')
const msgEl= document.getElementById('input-text')
const msgWrapper = document.getElementById('msgs')
const usersEl = document.getElementById('users')
const model = {
  users: {},
  currentUser: {
    id: '',
    name: ''
  },
  isNameCheckedOK: false
}

const views = {
  addMsg({name, msg}) {
    let node = document.createElement('li')
    node.innerText = `${name}: ${msg}`
    msgWrapper.appendChild(node)
    // 滾動至底
    msgWrapper.scrollTop = msgWrapper.scrollHeight
  },
  updateName({name}) {
    nameEl.value = name
  },
  updateNameInList({nv, ov}) {
    let targetEL = Array.from(usersEl.children)
      .find(e => e.innerText === ov)
    if(targetEL) targetEL.innerText = nv
  },
  showUsers({users}) {
    usersEl.innerHTML = ''
    for(let [k, v] of Object.entries(users.listObj)){
      let node = document.createElement('li')
      node.classList.add('list-group-item')
      node.innerText = v.name
      usersEl.appendChild(node)
    }
  }
}

const changeNameHandler = (name) => {
  let oldName = model.currentUser.name
  model.currentUser.name = name
  views.updateNameInList({nv: name, ov: oldName})
}

const checkName = (name) => {
  if(name === 'Server') {
    model.isNameCheckedOK = false
    alert('不能取這個名子，換一個吧')
    return 
  }
  let nameList = Object.values(model.users.listObj).map(e => e.name)
  let isOldName = model.currentUser.name === name
  if(!isOldName && nameList.includes(name)) {
    model.isNameCheckedOK = false
    alert('名子被別人取走了，換一個吧')
    return
  }
  model.isNameCheckedOK = true
}

const submitHandler = (e) => {
  e.preventDefault()
  let msg = msgEl.value
  let name = nameEl.value
  if( !msg || !name ) {
    alert('請輸入訊息')
    return 
  }
  checkName(name)
  if(!model.isNameCheckedOK) return
  views.addMsg({name, msg})
  changeNameHandler(name)
  socket.emit('chat msg', {name, msg})
  msgEl.value = ''
}

btn.addEventListener('click', submitHandler)

socket.on('connect', ()=>{
  model.currentUser.id = socket.id
})

socket.on('userConnected', (payload)=>{
  payload.name = 'Server'
  views.addMsg(payload)
})

socket.on('update name', (payload) => {
  let { name } = payload
  model.currentUser.name = name
  views.updateName({name})
})

socket.on('update users', (payload) => {
  model.users = payload.users
  views.showUsers(payload)
})

socket.on('userDisconnect', (payload) => {
  payload.name = 'Server'
  views.addMsg(payload)
})

socket.on('chat msg', (payload) => {
  views.addMsg(payload)
})

socket.on('name check', (payload) => {
  model.isNameCheckedOK = payload.isOK
  if(!model.isNameCheckedOK) {
    let msg = '用戶名稱重複或不允許，請充新命名'
    alert(msg)
    return
  }
})
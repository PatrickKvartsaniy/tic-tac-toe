const ws = new WebSocket("ws://127.0.0.1:8080")
const messages = document.getElementsByTagName("ul")[0]

alert("hello")

ws.onmessage = function(event){
    let message = document.createElement("li")
    let content = document.createTextNode(event.data)

    message.appendChild(content)
}

messages.appendChild(message)
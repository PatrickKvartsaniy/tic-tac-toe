// const ws = new WebSocket("ws://127.0.0.1:5678")

// ws.onmessage = function(event){
//     messages = document.getElementsByTagName("ul")[0]
//     let message = document.createElement("li")
//     let content = document.createTextNode(event.data)

//     messages.appendChild(message)
//     message.appendChild(content)
// };  


// Building the field with user size
const field = document.getElementById('field')

// Create class game

class Game{

    constructor(name1,name2,size){
        this.player1 = name1
        this.player2 = name2
        this.size = size
        this.turn = name1
    }

    move(){
        //
    }

    build(){
    
        let total_id = 0;
    
        for (let i = 0; i < this.size*this.size; i++) {
            let el = document.createElement('div')
            el.className = "squares"
    
            switch(this.size){
                case 3: 
                    el.style.width = "100px", 
                    el.style.height = "100px"
                    break
                case 4:
                    el.style.width = "75px",
                    el.style.height = "75px";
                    break
                default:
                    el.style.width = "60px",
                    el.style.height = "60px";
            }
    
            el.id = total_id
            el.state = null;
            el.onclick = function(){this.move()}
    
            field.appendChild(el)
            total_id++
        }
    }

    next_turn(){
        if (this.turn == this.player1){
            this.turn = this.player2
        }
        else{
            this.turn = this.player1
        }
    }

    move(){
        if (!this.state) {
            
            this.state = this.turn 
            console.log(this.state)

            if (this.turn == "Petro"){
                this.style.backgroundImage = "url(https://github.com/Kroid/tick-tack-30line/blob/master/img/player.jpg?raw=true)"
            }
            else{
                this.style.backgroundImage = "url(https://github.com/Kroid/tick-tack-30line/blob/master/img/ai.jpg?raw=trueg)"
            }
            // history = history.concat({"Player":state,"Square":id})
            this.next_turn()
        }
    }
}

game = new Game("Petro","Maria", 3)
game.build()

var history = []
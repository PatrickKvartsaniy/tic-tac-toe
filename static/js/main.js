ws = new WebSocket("ws://" + location.host + "/connect")

ws.onopen = function(){
    console.log("Connetcted")
    // ws.send("Connect")
}

ws.onmessage = function(e){

    // let msg = JSON.parse(e.data)

    // if (msg["Type"] == "Turn" && game.turn == msg["Player"]){
    //     sq[msg["Block"]].click()
    // }
    // console.log(msg["Block"])
    console.log(e.data)
}

ws.onclose = function(){
    console.log("Disconnected")
}

// Building the field with user size
const field = document.getElementById('field')

// Create class game

class Game{

    constructor(name1,name2,size){
        this.field = 
        this.player1 = name1
        this.player2 = name2
        this.size = size
        this.turn = name1
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
            el.onclick = function(){game.move(this)}
            el.style.backgroundSize = "100%";
            el.style.backgroundRepeat = "no-repeat";
            field.appendChild(el)
            total_id++
        }
    }

    move(obj){
        if (!obj.state) {
            
            obj.state = this.turn      
            if (this.turn == game.player1){
                obj.style.backgroundImage = "url(static/img/x.jpg)"
            }
            else{
                obj.style.backgroundImage = "url(static/img/o.jpg)"
            }
            // history = history.concat({"Player":state,"Square":id})
            this.isGameOver()
            ws.send(JSON.stringify({
                Type: "Turn",
                Player: this.turn,
                Block: obj.id
              }))
            this.next_turn()
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

    prepareMatrix() {

        let i, j
      
        for (i = 0, j = sq.length; i < j; i += this.size) {
          tmp.push(sq.slice(i, i + this.size))
        }

        for (let i = 0; i < tmp.length; i++) {
            let vertical = []
            diagonale1[i] = tmp[i][i]
            diagonale2[i] = tmp[i][tmp.length - i -1]
            for(let y = 0; y < tmp.length; y++){
                vertical.push(tmp[y][i])
            }
            verticals.push(vertical)
        }
      }

      isGameOver(){
        for(let i = 0; i<tmp.length; i++){
    
            if (tmp[i].every(player1Winner) || verticals[i].every(player1Winner) || diagonale1.every(player1Winner) || diagonale2.every(player1Winner)){
                alert(game.player1 + " win")
                location.reload()
            }
            else if (tmp[i].every(player2Winner) || verticals[i].every(player2Winner) || diagonale1.every(player2Winner) || diagonale2.every(player2Winner)){
                alert(game.player2 + " win")
                location.reload()
            }
            else if (tmp.every(x=>x==true)){
                alert("")
                location.reload()
            }
        }
    }

}

function player1Winner(element, index, Array){
    return element.state == game.player1
}

function player2Winner(element, index, Array){
    return element.state == game.player2
}


game = new Game("Petro","Maria", 3)
game.build()

var tmp = [], diagonale1 = [], diagonale2 = [], verticals = []
var sq = Array.from(document.getElementsByClassName('squares'))

game.prepareMatrix()
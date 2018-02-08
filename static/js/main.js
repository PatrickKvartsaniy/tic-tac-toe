// ws = new WebSocket("ws://" + location.host + "/connect")
const ws = io.connect('http://' + document.domain + ':' + location.port + "/game")


//Create player connection

class Player{
    
    constructor(name,table_size){
        this.name = name,
        this.table_size = table_size
    }
    connect(){
        // let names = document.getElementsByTagName('h4')
        // if(!this.table_size){
        //     names[1].innerHTML = this.name
        // }
        // else{
        //     names[0].innerHTML = this.name
        // }
        ws.emit('message', {
            Type: "Connection",
            name: this.name,
            size: this.table_size
          });
    }
}

var player1, player2

//Cheking if logged in and create player

if (!localStorage.getItem('player_name')){
    ws.disconnect()
    window.location.href = "/login"
}

else if (localStorage.getItem('table_size') != null){
    player1 = new Player(localStorage.getItem('player_name'),localStorage.getItem('table_size'))
    game_size = player1.table_size
    player1.connect()
}

else{
    player2 = new Player(localStorage.getItem('player_name'))
    player2.connect()
}
// ws.onmessage = function(message){

//     let msg = JSON.parse(e.data)

//     if (msg["Type"] == "Turn" && game.turn == msg["Player"]){
//         sq[msg["Block"]].click()
//     }
//     console.log(msg["Block"])
//     console.log(e.data)
    
// }

//Waiting for second player

function checkConnection(){
    if(!player1){
        try {
            ws.emit('message', {
                Type: "ping",
                player: "player1"
            });   
        } catch (error) {}
    }
    else if(!player2){
        try {
            ws.emit('message', {
                Type: "ping",
                player: "player2"
            });   
        } catch (error) {}
   }
}


ws.on('message', function(message){
 
    // console.log(message)

    if (message["Type"] == "Turn" && game.turn == message["Player"]){
        sq[parseInt(message["Block"])].click()
    }   

    else if (message["Type"] == "Connection"){

        if(!message["size"]){
            player2 = new Player(message['name'])
        }
        else{
            player1 = new Player(message['name'],message['size'])
            game_size = player1.game_size
        }
    }

    else if (message["Type"] == 'ping'){
        if(message['player'] == "player1"){
            try {
                ws.emit('message', {
                    Type: "Connection",
                    name: player1.name,
                    size: player1.table_size
                  });
            } catch (error) {}
        }
        else if(message['player'] == "player2"){
            try {
                ws.emit('message', {
                    Type: "Connection",
                    name: player2.name,
                    size: player2.table_size
                  });
            } catch (error) {}
        }
    }
})


ws.disconnect = function(){
    console.log("Disconnected")
}

// const field = document.getElementById('field')

// Create class game

var sq = []

class Table{
    constructor(size){
        this.size  = size
        this.tmp = []
        this.diagonale1 = []
        this.diagonale2 = []
        this.verticals = []
    }

    build(){
        let total_id = 0;
        let field = document.getElementById('field')

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
    
    prepareMatrix() {
        let i, j      
        for (i = 0, j = sq.length; i < j; i += this.size) {
            this.tmp.push(sq.slice(i, i + this.size))
        }

        for (let i = 0; i < this.tmp.length; i++) {
            let vertical = []
            this.diagonale1[i] = this.tmp[i][i]
            this.diagonale2[i] = this.tmp[i][this.tmp.length - i -1]
            for(let y = 0; y < this.tmp.length; y++){
                vertical.push(this.tmp[y][i])
            }
            this.verticals.push(vertical)
        }
      }

}


class Game{

    constructor(name1,name2,size){
        this.player1_name = name1
        this.player2_name = name2
        this.turn = name1
    }

// Creating and adding squares to field

    start(){
        table.build()
        let name_spaces = document.getElementsByTagName('h4')
        name_spaces[0].innerHTML = this.player1_name
        name_spaces[1].innerHTML = this.player2_name
    }

    move(obj){
        if (!obj.state) {
            
            obj.state = this.turn      
            if (this.turn == game.player1_name){
                obj.style.backgroundImage = "url(static/img/x.jpg)"
            }
            else{
                obj.style.backgroundImage = "url(static/img/o.jpg)"
            }
            // history = history.concat({"Player":state,"Square":id})
            this.isGameOver()
            // ws.send(JSON.stringify({
            //     Type: "Turn",
            //     Player: this.turn,
            //     Block: obj.id
            //   }))
            ws.emit('message', {
                    Type: "Turn",
                    Player: this.turn,
                    Block: obj.id
                  });
            this.next_turn()
        }
    }

    next_turn(){
        if (this.turn == this.player1_name){
            this.turn = this.player2_name
        }
        else{
            this.turn = this.player1_name
        }
    }


// Algorithm for make gameover cheking easyer

    isGameOver(){
        for(let i = 0; i<table.tmp.length; i++){
    
            if (table.tmp[i].every(player1Winner) || table.verticals[i].every(player1Winner) || table.diagonale1.every(player1Winner) || table.diagonale2.every(player1Winner)){
                alert(game.player1_name + " win")
                window.location.href = "/login"
            }
            else if (table.tmp[i].every(player2Winner) || table.verticals[i].every(player2Winner) || table.diagonale1.every(player2Winner) || table.diagonale2.every(player2Winner)){
                alert(game.player2_name + " win")
                window.location.href = "/login"
            }
            else if (table.tmp.every(x=>x==true)){
                alert("")
                window.location.href = "/login"
            }
        }
    }

}

function player1Winner(element, index, Array){
    return element.state == game.player1_name
}

function player2Winner(element, index, Array){
    return element.state == game.player2_name
}



// tmp = [], diagonale1 = [], diagonale2 = [], verticals = []

function Main(){
    active = false
    try {
        game = new Game(player1.name,player2.name)
        table = new Table(parseInt(player1.table_size))
        game.start()
        sq = Array.from(document.getElementsByClassName('squares'))
        table.prepareMatrix()
        active = true
    } catch (error) {
        console.log("Cheking connection")   
        checkConnection()
    }
    if(!active){
        setTimeout(function(){
            Main()
        },3000)
    }

}

Main()
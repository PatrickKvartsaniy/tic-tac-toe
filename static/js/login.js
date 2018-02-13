localStorage.removeItem("player_name");
localStorage.removeItem("table_size");
localStorage.removeItem("replay")

var join = document.getElementById('join')
var admin = document.getElementById('admin')

function joinCookie(){
    if (join[0].value!="") {
        localStorage.setItem("player_name",join[0].value)
        window.location.href = '/game'
    }
    else{
        alert("Fill the form, please")  
    }
}

function adminCookie(){
    if (admin[0].value != "" && admin[1].value !=""){
        localStorage.setItem("player_name",admin[0].value)
        localStorage.setItem("table_size",admin[1].value[0])
        window.location.href = '/game'
    }
    else{
        alert("Fill the form, please")
    }
}

function test(item){
    alert(item)
}

function replayCookie(tr){
    // console.log(tr)
    localStorage.setItem("replay",tr.childNodes[1].innerText)
    window.location.href = '/game'
}
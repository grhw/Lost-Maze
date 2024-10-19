s = ()=>{
var input = document.querySelector(".command-input")
var msg_history = document.querySelector(".message")
var canvas = document.querySelector(".main canvas.marks")
var marks = canvas.getContext("2d", {
    willReadFrequently: true
})

const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

function getLocFromDir(dir) {
    rad = degreesToRadians(dir%360)

    return [Math.round(Math.cos(rad)),Math.round(Math.sin(rad))]
}

function isCellBlocked(x,y) {
    window.dispatchEvent(new CustomEvent("giveMeCell", { detail: {x: x, y: y} }));
    console.log(window.cellFree)
    return window.cellFree
}

var cur_x = 25
var cur_y = 25
var dir = 0

function toRandomCell() {
    var plan_x = Math.floor(Math.random()*50)
    var plan_y = Math.floor(Math.random()*50)

    if (isCellBlocked(plan_x,plan_y)) {
        return toRandomCell()
    }
    cur_x = plan_x
    cur_y = plan_y
}

canvas.addEventListener("click",(ev)=>{
    const x = Math.floor((ev.offsetX/canvas.clientWidth)*canvas.getAttribute("width"))
    const y = Math.floor((ev.offsetY/canvas.clientHeight)*canvas.getAttribute("height"))
    const alpha = marks.getImageData(x,y,1,1).data[3]
    console.log(alpha)
    if (alpha == 0) {
        marks.fillStyle = "red"
        marks.fillRect(x,y,1,1)
    } else {
        marks.clearRect(x,y,1,1)
    }
})



const commands = {
    "end": ()=>{
        marks.fillStyle = "aqua"
        marks.fillRect(cur_x,cur_y,1,1)
        cur_x = -100
        cur_y = -100
        send("Game ended! Blue cell = location.<br>type '<span class=\"command\">restart</span>' to restart.")
    },
    "restart": ()=>{
        window.dispatchEvent(new CustomEvent("restart", {}));
        marks.clearRect(0,0,50,50)
        toRandomCell()
        send("Game started!")
    },
    "move": ()=>{
        move = getLocFromDir(dir)
        cur_x += move[0]
        cur_y += move[1]
        
        if (isCellBlocked(cur_x,cur_y)) {
            cur_x -= move[0]
            cur_y -= move[1]
            return send("I hit a wall.")
        }
        send("Moving..")

        //marks.fillStyle = "aqua"
        //marks.fillRect(cur_x,cur_y,1,1)
    },
    "left": ()=>{
        dir -= 90
        dir = dir%360
        send("Turning left!")
    },
    "right": ()=>{
        dir += 90
        dir = dir%360
        send("Turning right!")
    },
    "look": () => {
        var pLeft = getLocFromDir((dir - 90) % 360);
        var pRight = getLocFromDir(((dir + 90) + 360) % 360);

        var xLeft = cur_x + pLeft[0];
        var yLeft = cur_y + pLeft[1];

        var xRight = cur_x + pRight[0];
        var yRight = cur_y + pRight[1];

        if (isCellBlocked(xRight, yRight)) {
            send("and there's a wall on the right.");
        } else {
            send("and there's nothing to my right.");
        }

        if (isCellBlocked(xLeft, yLeft)) {
            send("wall on the left.");
        } else {
            send("nothing on my left.");
        }
}
}

function send(v) {
    if (Object.keys(commands).includes(v.toLowerCase())) {
        commands[v.toLowerCase()]()
        send("<br><span class=\"command\">" + v + "</span>")
    } else {
        var a = v
        msg_history.innerHTML.split("<br>").slice(0,20).forEach(msg => {
            a += "<br>" + msg
        });
        msg_history.innerHTML = a
    }
}

document.addEventListener("keypress",(e)=>{
    if (e.code == "Enter") {
        send(input.value)
        input.value = ''
    }
    if (cur_y == 0||cur_x == 0) {
        send("end")
        send("-- You win! --")
    }
})

send("restart")


};s()
var app = require('express')();
const path = require('path');

var http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


var client = null;
var fila = [];

io.on('connection', function (socket) {
    console.log('User Connected!');

    socket.on("isClient", (data) => {
        if (client == null) {
            client = socket;
        } else {
            fila.push(socket);
            socket.emit('bloqueado', fila.length);
        }
    });

    // On each "status", run this function
    socket.on("seguirFrente", (data) => {
        io.emit('frente');
    });
    socket.on("seguirTraz", (data) => {
        io.emit('traz');
    });
    socket.on("seguirDireita", (data) => {
        io.emit('direita');
    });
    socket.on("seguirEsquerda", (data) => {
        io.emit('esquerda');
    });

    socket.on("seguirParar", (data) => {
        io.emit('parar');
    });


    socket.on("disconnect", () => {
        

        if(client.id == socket.id){
            if (fila.length > 0) {
                client = fila.shift();
                io.emit('parar');
                client.emit("liberado");
            }else{
                client = null;
            }
        }else{
            fila = fila.filter(item => item.id !== socket.id);
        }      
    });

});

// Listen to port 3000
http.listen(port, function () {
    console.log('listening on *:', port);
});
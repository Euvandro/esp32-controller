var app = require('express')();
const path = require('path');
const { fileURLToPath } = require('url');

var http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

const port = process.env.PORT || 3000;

var client = null;
var fila = [];
var timeout;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/done', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/done.html'));
});

app.post('/release-slot', function (req, res) {
    client.emit("desconectar");

    if (fila.length > 0) {
        fila.push(client);
        client = fila.shift();
        client.emit("liberado");
        timeout = setTimeout(function() { client.emit("desconectar") }, 5 * 60 * 1000);
    }

    res.statusCode(200).send({});
});

io.on('connection', function (socket) {
    console.log('User Connected!');

    socket.on("isClient", (data) => {
        if (client == null) {
            client = socket;
            timeout = setTimeout(function() { client.emit("desconectar") }, 5 * 60 * 1000);
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
            io.emit('parar');
            clearTimeout(timeout);
            if (fila.length > 0) {
                client = fila.shift();
                client.emit("liberado");
                timeout = setTimeout(function() { client.emit("desconectar") }, 5 * 60 * 1000);
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
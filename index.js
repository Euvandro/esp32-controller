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

// When the server receives a post request on /sendData
app.post('/sendData', function (req, res) {

    //send data to sockets.
    console.log("teste");
    io.sockets.emit('parar', { message: "Hello from server!" })

    res.send({});
});

// When a new connection is requested

var client = null;
var fila = [];

io.on('connection', function (socket) {
    console.log('User Connected!');

    socket.on("isClient", (data) => {
        if (client == null) {
            console.log("Sem fila");
            client = socket;
        } else {
            console.log("com fila");
            fila.push(socket);
            socket.emit('bloqueado', fila.length);
        }
    });

    // On each "status", run this function
    socket.on("seguirFrente", (data) => {
        console.log("recebeu frente");
        io.emit('frente');
    });
    socket.on("seguirTraz", (data) => {
        console.log("recebeu traz");
        io.emit('traz');
    });
    socket.on("seguirDireita", (data) => {
        console.log("recebeu dir");
        io.emit('direita');
    });
    socket.on("seguirEsquerda", (data) => {
        console.log("recebeu esq");
        io.emit('esquerda');
    });

    socket.on("seguirParar", (data) => {
        console.log("recebeu parar");
        io.emit('parar');
    });


    socket.on("disconnect", () => {
        

        if(client.id == socket.id){
            if (fila.length > 0) {
                client = fila.shift();
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
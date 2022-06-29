# Remote control from web to ESP32-CAM

In this project you can control a 4wd chassis for arduino through the internet.

I'm using an ESP32-CAM with an h-bridge L298N.

For the communication of commands I'm using Socket.IO and for the video I'm using Ngrok to release the camera's local ip to the internet. The server is hosted on Heroku.

To access live: https://esp32-controller.herokuapp.com/

The service has a very simple queue system that I implemented with Javascript, so only one person can access it at a time. When someone disconnects it automatically releases access to the next one in the queue.

## Installation

Use the npm install command to install all the packages.

```bash
npm install
```

## Setting UP

###### File: esp32_camera_mjpeg

Set your wifi network password and ssid;
```c++
WiFi.begin("SSID", "PASSWORD");

```
Define your websocket server address just replacing: "MyServerAddress.com";
```c++
webSocket.begin("MyServerAddress.com", 80, "/socket.io/?transport=websocket");

```
After configuring these fields you can upload the code to the board.

###### File: public/index.html

Set the camera ip adress to the iframe tag.
I'm using [Ngrok](https://ngrok.com/) to serve my local camera ip to the web;
```html
<iframe class="camera iframe" src="https://your-camera-ip.com" width="640px" height="480px"></iframe>

```
Define your websocket server address by replacing: "https://esp32-controller.herokuapp.com/";
```javascript
const socket = io("https://esp32-controller.herokuapp.com/");

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
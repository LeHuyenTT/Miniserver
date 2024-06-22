const io = require("socket.io-client");

const socket = io("http://localhost:5001"); // Thay localhost bằng địa chỉ thực của server

socket.on("connect", () => {
  console.log("Connected to server");

  // Khi kết nối thành công, gửi một tin nhắn để đăng ký với server
  socket.emit("message", "Client connected");
});

socket.on("message", (data) => {
    endTime = performance.now();
    console.log("Delay: ", endTime-startTime);
  console.log("Received message from server:", data.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    //这个可以设置成http://ip地址:端口号/项目名/websocket的连接地址。
    //也可以设置成/项目名/websocket的连接地址
    var socket = new SockJS('http://localhost:8080/stomp');
    stompClient = Stomp.over(socket);
    //与服务器建立连接
    stompClient.connect(
        //第一个参数：表示连接时候发送的请求同，例如：谁发送的连接，token等信息
        {},
        //连接成功之后的信息
        function (frame) {
        setConnected(true);
        //表示连接成功之后，监听的内容，只要服务器向这个/topic/grertings发送数据，那么这个客户端就能收到数据。
        stompClient.subscribe('/queue/d1', function (name) {
            showGreeting(name);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        //断开连接
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    //向服务器发送消息
    $("#greetings").html("");
    stompClient.send("/app/test", {},  $("#name").val());
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});
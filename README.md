# chat

Chat!:speech_balloon: An online chat app that supports private & group chat, built with React + Spring Boot

Now at http://82.156.32.6/ !

## Notes:

- [chat-app](https://github.com/astro2049/chat/tree/main/chat-app): client (front end) web app, **React** project
- [chat](https://github.com/astro2049/chat/tree/main/chat): server-side (back end) **Spring Boot** project (forwards messages to RabbitMQ server)

Chat messages travel on STOMP over WebSocket.

## Requirements:

- [Node.js](https://nodejs.org/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [MongoDB](https://www.mongodb.com/)

## Some Thoughts...

This app adopts typical publish-subscribe architecture: 

- *Spring Boot server* + *RabbitMQ server* as *Event notification server (ENS)*, 
- *React app Web client* as *Consumer client* & *Publisher client*
- as for *Directory service (DS)*...

## Major Implementation Reference (server side):

[Build a Chat Application using Spring Boot + WebSocket + RabbitMQ](https://www.javainuse.com/spring/boot-websocket-chat) - JavaInUse


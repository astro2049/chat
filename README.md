# Chat!

Chat! is an online chat site with private & group chat :tent:

Now at https://www.astro.ski/ !

## Notes:

- [chat-app](https://github.com/astro2049/chat/tree/main/chat-app): **React app**, Web client
- [moonrise-kingdom](https://github.com/astro2049/chat/tree/main/moonrise-kingdom): **Laravel app**, handles persistent logics
- [chat](https://github.com/astro2049/chat/tree/main/chat): **Spring Boot app**, handles chat logics

**chat messages travel on STOMP over WebSocket*

### Architecture Map:

![archi (3840 x 2160 px)](https://user-images.githubusercontent.com/45759373/147645137-ad1fd945-62f3-4f2e-b11e-68ccb7492c33.png)

## Requirements:

- [Node.js](https://nodejs.org/)
- [PHP 8](https://www.php.net/releases/8.0/en.php)
- [MySQL](https://www.mysql.com/)
- [Java 16](https://adoptopenjdk.net/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [MongoDB](https://www.mongodb.com/)

## Some Thoughts...

In realizing chatting, the application adopts a publish-subscribe pattern:

- *Spring Boot server* + *RabbitMQ server* as *Event notification server (ENS)*
- *React app Web client* as *Consumer client* & *Publisher client*

## Implementation Reference (chat features):

[Build a Chat Application using Spring Boot + WebSocket + RabbitMQ](https://www.javainuse.com/spring/boot-websocket-chat) - JavaInUse


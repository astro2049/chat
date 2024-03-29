# Chat!

Chat! is an online chat site with private & group chat :tent:

## Notes:

- [chat-app](https://github.com/astro2049/chat/tree/main/chat-app): **React app**, Web client
- [moonrise-kingdom](https://github.com/astro2049/chat/tree/main/moonrise-kingdom): **Laravel app**, handles persistent logics
- [chat](https://github.com/astro2049/chat/tree/main/chat): **Spring Boot app**, handles chat logics

**chat messages travel on STOMP over WebSocket*

### Architecture Map:

![archi (3840 x 2160 px)](https://user-images.githubusercontent.com/45759373/162733595-c3e5ba5f-f285-4c18-a8ad-3b25503762b3.png)

## Requirements:

- [Node.js](https://nodejs.org/)
- [PHP 8](https://www.php.net/releases/8.0/en.php)
- [MySQL](https://www.mysql.com/)
- [Java 16](https://adoptopenjdk.net/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [MongoDB](https://www.mongodb.com/)

## Some Thoughts...

The application adopts a publish-subscribe pattern to realize Web-based chatting:

- *Spring Boot server* + *RabbitMQ server* as *Event notification server (ENS)*
- *React app Web client* as *Consumer client* & *Publisher client*

## Implementation Reference (chat features):

[Build a Chat Application using Spring Boot + WebSocket + RabbitMQ](https://www.javainuse.com/spring/boot-websocket-chat) - JavaInUse


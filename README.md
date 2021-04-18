# chat

Chat!:speech_balloon: An online chat app that supports private & group chat, built with React + Spring Boot, homework (currently under development)

## Notes:

- [chat-app](https://github.com/astro2049/chat/tree/main/chat-app): client (front end) web app, **React** project
- [chat](https://github.com/astro2049/chat/tree/main/chat): server-side (back end) **Spring Boot** project (forwards messages to RabbitMQ server)

The web app and the server communicate with STOMP over WebSocket in realizing the chat function.

## Requirements:

- [Node.js](https://nodejs.org/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [MongoDB](https://www.mongodb.com/)

## Some Thoughts...

I think this app is quite a typical publish-subscribe application (well, it's my homework to build one after all...): *Spring Boot server* as *Directory service (DS)* & publisher-side *Event notification server (ENS)*, *RabbitMQ server* as consumer-side *ENS* and *web client* as *Consumer client* & *Publisher client* (the two clients' behaviors are independent).



P.S. homework's the 2 exercises as follows:

[*Anthony, R: Systems Programming: Designing and Developing Distributed Applications*](https://booksite.elsevier.com/9780128007297/)

*End of Chapter Programming Exercises:*

> 1. Integrate the NTP client-side functionality into an application. This programming challenge  relates to the time service client use case. 
>
>    The task. Build an NTP client functionality into any application of your choice. You are  recommended to use the NTP library provided as part of the support materials. Start by studying  the program code of the two provided NTP application client programs, which integrate the  library and then mimic this library integration in your own application.
>
>    Note that the two application clients already discussed in the time service case study serve as  sample answers for this exercise. 
>
> 2. Develop a publish-subscribe application, which uses an external ENS as a means of decoupling  the application components. You are recommended to use the ENS presented in the second case  study in this chapter.
>
>    The event types and values will depend on the theme of the application you choose; for example,  in a distributed game application, there may be event types such as new-player-arrival and  new-game-started. Begin by studying the program code of the sample application publisher  and consumer components provided as part of the supporting resources for the book. Consider  developing your publisher in one language and your consumer in another, to experiment with the  heterogeneity and interoperability aspects.
>
>    Note that the application clients already discussed in the ENS case study serve as sample  answers for this exercise.


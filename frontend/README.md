# Frontend for Multiplayer Wordle

A frontend for the multiplayer version of the popular word guessing game, Wordle. Built with React and Material UI, this application provides an interactive and real-time user experience for players competing against each other.

## Table of Contents

- [Frontend for Multiplayer Wordle](#frontend-for-multiplayer-wordle)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Commands](#commands)

## Features

- **Real-Time Communication**: Utilizes Socket.IO for real-time updates between players and the server.
- **Responsive Design**: Built with Material UI for a modern, user-friendly interface.
- **CSS Animation**: Includes various animations that enhance user interactions, such as when a user inputs or submits their guess.
- **Multiple Instances**: Can run multiple instances of the app for local development and testing on different ports.

## Technologies

- **React**: A JavaScript library for building user interfaces.
- **Material UI**: A popular React UI framework that implements Google's Material Design.
- **Socket.IO Client**: For enabling real-time, bidirectional communication.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **CSS**: Used for creating smooth animations during user interactions.

## Commands

Run as player one by one,

```bash
npm run dev:p1
npm run dev:p2
npm run dev:p3
npm run dev:p4
```

or start all in one command,
```bash
npm run dev:all
```
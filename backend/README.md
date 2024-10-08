# Multiplayer Wordle Backend Server

A backend server for a multiplayer version of the popular word guessing game, Wordle. The server is built with Node.js and utilizes Express and Socket.IO for real-time communication, and TypeScript for type safety.

## Table of Contents

- [Multiplayer Wordle Backend Server](#multiplayer-wordle-backend-server)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Command](#command)

## Features

- **Multiplayer Support:** Allows multiple players to join the same game room.
- **Real-time Updates:** Uses Socket.IO for instant communication between players and the server.
- **Word Guessing Logic:** Implements logic for validating guesses and determining game outcomes (win, lose, draw).
- **Dynamic Word Selection:** Randomly selects words from a dictionary file for each game.

## Technologies

- **Node.js** - JavaScript runtime for building the server.
- **Express** - Web framework for handling HTTP requests.
- **Socket.IO** - Library for real-time web applications, enabling bi-directional communication.
- **TypeScript** - Typed superset of JavaScript for better maintainability.
- **Jest** - Testing framework for unit and integration testing.
- **dotenv** - Module to load environment variables from a `.env` file.

## Command

To start the server, server will start at `localhost:4000`.

```bash
npm run dev
```

To run test script,

```bash
npm test
```

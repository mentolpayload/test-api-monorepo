const { Server } = require('topper');
const server = new Server('127.0.0.1', 8889);
const randomWords = require('random-words');

const rndWords = randomWords({exactly:1, wordsPerString:2})[0];

const tasks = [
  {
    name: 'phrase',
    task: async (data, socket) => await socket.write(rndWords)
  },
]

server.multiTask(tasks);

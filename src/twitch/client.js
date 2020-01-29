const tmi = require("tmi.js");
const dotenv = require("dotenv");
dotenv.config();
console.log(
  `Hmm: ${process.env.TWITCH_USER} ${process.env.TWITCH_OAUTH} ${process.env.TWITCH_CHANNEL}`
);
const twitchClient = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.TWITCH_USER,
    password: process.env.TWITCH_OAUTH
  },
  channels: [process.env.TWITCH_CHANNEL]
});

twitchClient.connect();

module.exports = twitchClient;

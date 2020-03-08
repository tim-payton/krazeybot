const dotenv = require("dotenv");
const client = require("./client");
dotenv.config();
const audioPath = process.env.AUDIO_PATH;

const joinVoiceChannel = async channelId => {
  const channel = client.channels.cache.get(channelId);
  channel.join();
};

const playSoundEffect = async (file, volumeLevel) => {
  const broadcast = client.voice.createBroadcast();
  broadcast.play(`${audioPath}${file}`, {
    volume: volumeLevel | 1
  });
  // Play "music.mp3" in all voice connections that the client is in
  for (const connection of client.voice.connections.values()) {
    connection.play(broadcast);
  }
};

module.exports = { playSoundEffect, joinVoiceChannel };

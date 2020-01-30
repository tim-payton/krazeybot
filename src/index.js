const Discord = require("discord.js");
const axios = require("axios");
const dotenv = require("dotenv");
const ffmpeg_static = require("ffmpeg-static");
const shakespeare = require("shakespeare-insult");
const discordClient = require("./discord/client");
const voiceChannel = require("./discord/voicechannel");
const twitchClient = require("./twitch/client");
dotenv.config();

const { playSoundEffect, joinVoiceChannel } = voiceChannel;

const commands = message => {
  switch (message.content) {
    case "!join":
      joinVoiceChannel("633925300912128030");
      break;
    case "krazey2keg":
      playSoundEffect("barrel.mp3");
      break;
    case "krazey2honk":
      playSoundEffect("honk.wav");
      break;
    case "!scaryviolins":
      playSoundEffect("scaryviolins.mp3", 0.3);
      break;
    case "!sad":
      playSoundEffect("sad.mp3");
      break;
    case "!rocket":
      playSoundEffect("rocket.mp3");
      break;
    case "!voice":
      playSoundEffect("voice.mp3");
      break;
    case "!bye":
      playSoundEffect("bye.mp3");
      break;
    case "!jumpscare":
      playSoundEffect("jumpscare.mp3");
      break;
    case "!feels":
      playSoundEffect("feels.mp3");
      break;
    case "!door":
      playSoundEffect("door.mp3");
      break;
    case "!alienhiss":
      playSoundEffect("alienhiss.mp3");
      break;
    case "!data":
      playSoundEffect("data.mp3");
      break;
    case "!nice":
      playSoundEffect("nice.mp3");
      break;
    case "!clap":
      playSoundEffect("clap.mp3");
      break;
    case "!misty":
      playSoundEffect("misty.mp3");
      break;
    case "!banana":
      playSoundEffect("banana.mp3");
      break;
    case "!insult":
      const permissions = message.member.roles.some(r =>
        ["Stream team", "Admin"].includes(r.name)
      );
      console.log(`available permissions for user: ${permissions}`);
      if (permissions) {
        axios
          .get("https://evilinsult.com/generate_insult.php?lang=en&type=json")
          .then(function(response) {
            // handle success
            message.channel.send(response.data.insult);
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
      }
      break;
    case "!compliment":
      axios
        .get("https://complimentr.com/api")
        .then(function(response) {
          // handle success
          message.channel.send(`${response.data.compliment} ${message.author}`);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
      break;
    case "!yeoldinsult":
      message.channel.send(shakespeare.random());
    default:
      break;
  }
};

twitchClient.on("message", (channel, tags, message, self) => {
  if (self) return;
  const newMessage = {
    content: message.toLowerCase()
  };
  commands(newMessage);
});

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("message", async message => {
  commands(message);
});

// Create an event listener for new guild members
discordClient.on("guildMemberAdd", member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === "general");
  // Do nothing if the channel wasn't found on this server
  if (!channel) {
    console.log("hmm, we weren't able to find the channel");
    return;
  }
  // Send the message, mentioning the member
  console.log(
    `New User "${member.user.username}" has joined "${member.guild.name}"`
  );
  channel.send(
    `Hey ${member.user.username}, welcome to The Fold :tada::hugging:!`
  );
});

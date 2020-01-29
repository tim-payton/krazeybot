const tmi = require("tmi.js");
const axios = require("axios");
const dotenv = require("dotenv");
const ffmpeg_static = require("ffmpeg-static");
const shakespeare = require("shakespeare-insult");
const voiceChannel = require("./discord/voicechannel");
dotenv.config();
const discordClient = require("./discord/client");

const { playSoundEffect, joinVoiceChannel } = voiceChannel;

const twitchClient = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: "krazeybot",
    password: "oauth:sod8595cyz6zaow8n14k5i5a135ov4"
  },
  channels: ["krazeyhazey"]
});

twitchClient.connect();
twitchClient.on("message", (channel, tags, message, self) => {
  if (self) return;
  if (message.toLowerCase() === "!hello") {
    twitchClient.say(channel, `@${tags.username}, heya!`);
  }
  if (message.toLowerCase() === "!fire") {
    playSoundEffect("barrel.mp3");
  }
});

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("message", async message => {
  switch (message.content) {
    case "!join":
      await joinVoiceChannel("633925300912128030");
      break;
    case "!fire":
      await playSoundEffect("barrel.mp3");
      break;
    case "!honk":
      await playSoundEffect("honk.wav");
      break;
    case "!scaryviolins":
      await playSoundEffect("scaryviolins.mp3", 0.3);
      break;
    case "!sad":
      await playSoundEffect("sad.mp3");
      break;
    case "!rocket":
      await playSoundEffect("rocket.mp3");
      break;
    case "!voice":
      await playSoundEffect("voice.mp3");
      break;
    case "!bye":
      await playSoundEffect("bye.mp3");
      break;
    case "!jumpscare":
      await playSoundEffect("jumpscare.mp3");
      break;
    case "!feels":
      await playSoundEffect("feels.mp3");
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

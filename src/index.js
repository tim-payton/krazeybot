const Discord = require("discord.js");
const axios = require("axios");
const client = new Discord.Client();
const dotenv = require("dotenv");
const ffmpeg_static = require("ffmpeg-static");
const shakespeare = require("shakespeare-insult");
dotenv.config();

const audioPath = process.env.AUDIO_PATH;
const discordBotKey = process.env.DISCORD_BOT_KEY;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async message => {
  const playSoundEffect = async (file, volumeLevel) => {
    if (!message.guild) return;

    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play(`${audioPath}${file}`, {
        volume: volumeLevel
      });
    } else {
      message.reply("You need to join a voice channel first!");
    }
  };

  switch (message.content) {
    case "!fire":
      playSoundEffect("barrel.mp3");
      break;
    case "!honk":
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
client.on("guildMemberAdd", member => {
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

client.login(discordBotKey);

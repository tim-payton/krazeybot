const axios = require("axios");
const dotenv = require("dotenv");
const shakespeare = require("shakespeare-insult");
const discordClient = require("./discord/client");
const voiceChannel = require("./discord/voicechannel");
const twitchClient = require("./twitch/client");
const minecraft = require("./minecraft/rconCommands");

dotenv.config();

const { playSoundEffect, joinVoiceChannel } = voiceChannel;
const { rconCommand } = minecraft;

let game = process.env.GAME_TYPE || null;

const commands = async (message, source, channel) => {
  if (message.content) {
    const [command, ...msg] = message.content.split(" ");
    const adminPermissions =
      source === "discord"
        ? message.member.roles.cache.some(r =>
            ["Stream team", "Admin"].includes(r.name)
          )
        : false;
    if (game === "phasmophobia"){
      switch (command){
        case "!gamecommands":
          twitchClient.say(channel,"Commands available are: \n!heartbeat \n!doorhandle");
        case "!heartbeat":
          const heatBeatCooldown = 60000;
          let lastheartBeat;
          if (Date.now() - lastheartBeat > heatBeatCooldown){
            lastheartBeat = Date.now();
            playSoundEffect("phasmophobia/Heartbeat (loop) 2.wav");
          } else {
            console.log('cooldown activated for heartbeat');
          }
          break;
        case "!doorhandle":
          playSoundEffect(`phasmophobia/Door handle open ${Math.floor((Math.random() * 11) + 1)}.wav`);
          break;
        case "!closebook":
          playSoundEffect('phasmophobia/close_book_04.wav');
          break;
        case "!burn":
          playSoundEffect('phasmophobia/CrucifixBurn.wav');
          break;
        case "!stairs":
          playSoundEffect(`phasmophobia/Stairs footsteps ${Math.floor((Math.random() * 10) + 1)}.wav`);
          break;
        case "!throw":
          playSoundEffect(`phasmophobia/Throwing ${Math.floor((Math.random() * 11) + 1)}.wav`);
          break; 
        case "!humming":
          if(Math.random() >= 0.5){
            playSoundEffect(`phasmophobia/WomanHumming.wav`);
          } else {
            playSoundEffect(`phasmophobia/ManHumming.wav`);
          }
          break; 
      }
    }
    
    switch (command) {
      case "!setphasmophobia":
        game = "phasmophobia";
        message.channel.send("Phasmophobia game type now set!");
        twitchClient.say(channel,"Phasmophobia sound effects are now ACTIVATED, please use wisely!");
        break;
      case "!resetmode":
        game = null;
        message.channel.send("Game type cleared!");
        break;
      case "!join":
        joinVoiceChannel("633925300912128030");
        break;
      case "!scaryviolins":
        playSoundEffect("scaryviolins.mp3", 0.3);
        break;
      case "!jumpscare":
        playSoundEffect("jumpscare.mp3");
        break;
      case "!door":
        playSoundEffect("door.mp3");
        break;
      case "!weewoo":
        playSoundEffect("weewio.mp3");
        break;
      case "!stabscare":
        playSoundEffect("stabscare.mp3");
        break;
      case "!ghosts":
        playSoundEffect("moaningpassinghosts.mp3");
        break;
      case "!death":
        playSoundEffect("death.mp3");
        break;
      case "!ambi":
        playSoundEffect("ambi.mp3");
        break;
      case "!passthetorch":
        playSoundEffect("Verbiums_torch.mp3");
        break;
      case "!insult":
        if (adminPermissions) {
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
            message.channel.send(
              `${response.data.compliment} ${message.author}`
            );
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
        break;
      case "!yeoldinsult":
        message.channel.send(shakespeare.random());
        break;
      case "!minecraft":
        if (adminPermissions) {
          const [command, operator, ...params] = msg;
          const response = await rconCommand(
            `${command} ${operator} ${params}`
          );
          message.channel.send(`mc server response: ${response}`);
        }
        break;
      case "!l4d2":
        const [command, operator, ...params] = msg;
        const response = await rconCommand(
          `${command} ${operator} ${params}`
        );
        message.channel.send(`l4d2 server response: ${response}`);
      default:
        break;
    }
  }
};

twitchClient.on('message', (channel, tags, message, self) => {
  console.log(`context: ${JSON.stringify(tags)}`);
  if (self) return;
  const newMessage = {
    content: message.toLowerCase()
  };
  commands(newMessage, "twitch",channel);
});

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("message", async message => {
  commands(message, "discord");
});

// Create an event listener for new guild members
discordClient.on("guildMemberAdd", member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === "general");
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

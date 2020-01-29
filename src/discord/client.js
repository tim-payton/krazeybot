// Config for discord.js client
const Discord = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const discordBotKey = process.env.DISCORD_BOT_KEY;
const discordClient = new Discord.Client();
discordClient.login(discordBotKey);

module.exports = discordClient;

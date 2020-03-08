const { Rcon } = require("rcon-client");

const rconCommand = async command => {
  const rcon = await Rcon.connect({
    host: "minecraft.supereffectivephotography.com",
    port: 25575,
    password: "kA7H^7s!#@pw6RP7m*S"
  });
  console.log(command);
  let response = await rcon.send(command);
  return response;
};

module.exports = {
  rconCommand
};

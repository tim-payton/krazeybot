const { Rcon } = require("rcon-client");

const rconCommand = async command => {
  const rcon = await Rcon.connect({
    host: "localhost",
    port: 27015,
    password: "test"
  });
  console.log('command:', command);
  let response = await rcon.send(command);
  return response;
};

module.exports = {
  rconCommand
};

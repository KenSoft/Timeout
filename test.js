var moment = require('moment');
const Discord = require("discord.js");
const { Client, GatewayIntentBits } = require('discord.js');
let BOT_TOKEN = "MTA3MzA3OTA2MDczMDc0ODkyOA.GkYH5R.sAg7642_nm84LEWybcRtaDYE-JqMbtBFTTHCj4";

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
})

client.login(BOT_TOKEN);

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);


 //console.log(channel);
});

function sendMessage(message){
client.once("ready", async () => {
  // Fetch the channel
  const channel = await client.channels.fetch("1073079891085500456")
  // Note that it's possible the channel couldn't be found
  if (!channel) {
    return console.log("could not find channel")
  }

  channel.send(message)
})
}
sendMessage("Test");

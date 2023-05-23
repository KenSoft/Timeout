var moment = require('moment');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getDatabase, ref, set, get, child } = require('firebase/database');
const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const Discord = require("discord.js");
require('dotenv').config()
const { firebaseConfig, botToken } = require('../core/config')


const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
})

client.login(botToken);

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 
 //console.log(channel);
});

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


initializeApp(firebaseConfig);
let database = ref(getDatabase());

module.exports = {
  data: new SlashCommandBuilder()
    .setName('russianroulette')
    .setDescription('A Gift from God!'),
  async execute(interaction) {
    await interaction.reply('Russian Roulette!');
    var hasSpecialPerson = 0;
    var specialPersonId = "283195180352274433";
    var timer = 10;
    var random1 = between(0,100);
    var count = 0;
    var iterator = 0;
    var specialMemberObject = null;
    const channel = await client.channels.fetch("994270324776517787")
    const fetchedChannel = await channel.fetch(true)
    const members = fetchedChannel.members
    
    var target = null;
    members.forEach(member => {
                  //console.log(member.id)
      if(member.id == specialPersonId){
        hasSpecialPerson==1;
        specialMemberObject = member;
      }
      count++;
    });
    console.log(count);
    var random2 = between(0,count);
    console.log(random2);
    if(hasSpecialPerson==1 && random1<70){
      target=member;
    } else {
        members.forEach(member => {
                  //console.log(member.id)
        if(iterator==random2){
          target = member;
        }
        iterator++
      });
    }

    const mainLoop = setInterval(function() {

      interaction.editReply('Russian Roulette in '+timer+' second(s)!');
      
      if(timer == 0){
        target.voice.setChannel(null);
        interaction.editReply('Russian Roulette NOW!');
        clearInterval(mainLoop);
      }
      timer--;
    },1000);
  },};
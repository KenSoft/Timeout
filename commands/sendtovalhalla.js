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




initializeApp(firebaseConfig);
let database = ref(getDatabase());


module.exports = {
	data: new SlashCommandBuilder()
		.setName('sendtovalhalla')
		.setDescription('Nói tiếng Việt không được')
		.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to send to Valhalla')
			.setRequired(true))
		.addIntegerOption(option =>
		option.setName('time')
			.setDescription('Time in minute until the target is being sent to Valhalla')
			.setRequired(true)
			// Ensure the text will fit in an embed description, if the user chooses that option
			.setMinValue(0)
			.setMaxValue(1440)),
	async execute(interaction) {
		const channel = await client.channels.fetch("1003726687789387868")
		//channel.send("message")
		let member = interaction.options.getMember('target');
		let memberId = member.id.toString();
		const time = interaction.options.getInteger('time')
		if(time!=0){
			await interaction.reply('Sending <@'+member.id+'> to Valhalla '+time+' minute(s)!');
		} else {
			await interaction.reply('Cancelled scheduled one-way ticket to Valhalla for <@'+member.id+'>!');
		}
		set(child(database, 'valhalla/'+memberId), {
			"tol":time*60
		});
		const mainLoop = setInterval(function() {
			try{
				//console.log("Running");
				get(child(database, `valhalla/`+memberId+"/tol")).then((snapshot) => {
				  if (snapshot.exists()) {
				  	console.log(memberId+": "+snapshot.val());
				    if(snapshot.val()>0){
					    set(child(database, 'valhalla/'+memberId), {
							  "tol":snapshot.val()-1
							})
							.then(() => {
							  // Data saved successfully!
							})
							.catch((error) => {
							  // The write failed...
							});
						}
						if(snapshot.val()==1){
							initializeApp(firebaseConfig);
							//ban
							channel.send("Sent <@"+member.id+"> to Valhalla! Enjoy!");
							member.timeout(60*1000);
							clearInterval(mainLoop);
						}
						if(snapshot.val()==0){
							clearInterval(mainLoop);
						}
						if(snapshot.val()==60){
							channel.send('Sending <@'+member.id+'> to Valhalla in 1 minute!');
						}
						if(snapshot.val()==300){
							channel.send('Sending <@'+member.id+'> to Valhalla in 5 minutes!');
						}
						if(snapshot.val()==900){
							channel.send('Sending <@'+member.id+'> to Valhalla in 15 minutes!');
						}
						if(snapshot.val()==3600){
							channel.send('Sending <@'+member.id+'> to Valhalla in 60 minutes!');
						}
				  } else {
				    console.log("No data available");
				  }
				}).catch((error) => {
				  console.error(error);
				});
			} catch (error) {
			  console.error(error);
			  // Expected output: ReferenceError: nonExistentFunction is not defined
			  // (Note: the exact output may be browser-dependent)
			}
		}, 1000);
	},
};
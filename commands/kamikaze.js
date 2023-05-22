const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getDatabase, ref, set, get, child } = require('firebase/database');
const { SlashCommandBuilder } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const Discord = require("discord.js");
require('dotenv').config()

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.FIREBASE_DATABASE_URL,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ]
})

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 
 //console.log(channel);
});

initializeApp(firebaseConfig);
let database = ref(getDatabase());

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kamikaze')
		.setDescription('Good night everyone!')
		.addIntegerOption(option =>
		option.setName('time')
			.setDescription('Time in minute until blow up!')
			.setRequired(true)
			// Ensure the text will fit in an embed description, if the user chooses that option
			.setMinValue(0)
			.setMaxValue(10)),
	async execute(interaction) {

		const time = interaction.options.getInteger('time')
		if(time!=0){
			await interaction.reply('Kamikaze in '+time+' minute(s)!');
		} else {
			await interaction.reply('Cleared pending Kamikaze!');
		}
		const channelArray = ["994270324776517787","994270324776517788","999360801393614948","1034861905912803419","1034862709721804870","1060541263541186582"];
		const channelBot = await client.channels.fetch("1003726687789387868")
		var channel = [];
		var fetchedChannel = [];
		for (var i = 0; i < 5; i++) {
			channel[i] = await client.channels.fetch(channelArray[i])
			fetchedChannel[i] = await channel[i].fetch(true)
		}
			
		set(child(database, 'kamikaze/'), {
			"time":time*60
		});

		const mainLoop = setInterval(function() {
		try{
			
			get(child(database, `kamikaze/time`)).then((snapshot) => {
				  if (snapshot.exists()) {
				  	
				    if(snapshot.val()>0){
				    	interaction.editReply('Kamikaze in '+snapshot.val()+' second(s)!');
					    set(child(database, 'kamikaze/'), {
							  "time":snapshot.val()-1
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
							var moment = require('moment');
							let timeoutSec = 0;
							var until = moment(new Date()).add(1,'days');
							until.set('hour', 10);
							until.set('minute', 0);
							until.set('second', 0);
							var a = moment();
							timeoutSec = until.diff(a, 'seconds'); // 1
							if(until.diff(a, 'minutes')>1440){
								until = moment(new Date()).add(0,'days');
								until.set('hour', 10);
								until.set('minute', 0);
								until.set('second', 0);
								timeoutSec = until.diff(a, 'seconds'); // 1
							}
							set(child(database, 'comeback/'), {
								"time":timeoutSec
							});
							const subLoop = setInterval(function() {
							get(child(database, `comeback/time`)).then((snapshot) => {
				  			if (snapshot.exists()) {
				  				set(child(database, 'comeback/'), {
								  "time":snapshot.val()-1
								})
								.then(() => {
								  // Data saved successfully!
								})
								.catch((error) => {
								  // The write failed...
								});

							if(snapshot.val()==0){
								for (var i = 0; i < 6; i++) {
									const members = fetchedChannel[i].members
									//console.log('Members: ', members)
									channel[i].permissionOverwrites.set([
										{
											id: "994270323954425967",
											allow: [PermissionsBitField.Flags.ViewChannel],
										},
										{
											id: "1109575362972749935",
											allow: [PermissionsBitField.Flags.ViewChannel,PermissionsBitField.Flags.ManageChannels],
										},
									]);
								}
								channelBot.send("Returning All Channels...")
								clearInterval(subLoop);
							}
				  			} else {
							console.log("No data available");
							  }
							}).catch((error) => {
							  console.error(error);
							});
							},1000);
							interaction.editReply('Kamikaze now! Good night everyone!');
							for (var i = 0; i < 6; i++) {
								const members = fetchedChannel[i].members
								//console.log('Members: ', members)
								members.forEach(member => {
								  //console.log(member.id)
								  member.voice.setChannel(null);
								});
								channel[i].permissionOverwrites.set([
									{
										id: "994270323954425967",
										deny: [PermissionsBitField.Flags.ViewChannel],
									},
									{
										id: "1109575362972749935",
										allow: [PermissionsBitField.Flags.ViewChannel,PermissionsBitField.Flags.ManageChannels],
									},
								]);
							}
							
						}
						
						if(snapshot.val()==0){
							clearInterval(mainLoop);
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

function blowUp(){

	
}
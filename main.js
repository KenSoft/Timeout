const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getDatabase, ref, get, child, set } = require('firebase/database');
var moment = require('moment');
const fs = require('node:fs');
const path = require('node:path');
const Discord = require("discord.js");
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const key = require('./key');

initializeApp(key.firebaseConfig);
let database = ref(getDatabase());


const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
})

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}



client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(key.BOT_TOKEN);

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 
 //console.log(channel);
});

const mainLoop = setInterval(function() {
	console.log("Running");
	get(child(database, `timeout/tol`)).then((snapshot) => {
	  if (snapshot.exists()) {
	    console.log(snapshot.val());
	    set(ref(database, 'timeout/'), {
			  "tol":20
			})
			.then(() => {
			  // Data saved successfully!
			})
			.catch((error) => {
			  // The write failed...
			});



	  } else {
	    console.log("No data available");
	  }
	}).catch((error) => {
	  console.error(error);
	});

}, 1000);

//clearInterval(interval); 
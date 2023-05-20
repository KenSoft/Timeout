var moment = require('moment');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getDatabase, ref, set } = require('firebase/database');
const { SlashCommandBuilder } = require('discord.js');
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

initializeApp(firebaseConfig);
let database = getDatabase();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeoutwithlove')
		.setDescription('Nói tiếng Việt không được')
		.addIntegerOption(option =>
		option.setName('time')
			.setDescription('Time in minute until timeout')
			.setRequired(true)
			// Ensure the text will fit in an embed description, if the user chooses that option
			.setMinValue(0)
			.setMaxValue(1440)),
	async execute(interaction) {
		const time = interaction.options.getInteger('time')
		await interaction.reply(`Reply! ${time} `+moment().format('YYYY-MM-DD-hh-mm-ss'));
		set(ref(database, 'timeout/'), {
			"tol":time*60
		  });
	},
};
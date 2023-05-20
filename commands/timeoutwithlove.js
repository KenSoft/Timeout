var moment = require('moment');
const key = require('../key');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getDatabase, ref, set } = require('firebase/database');
const { SlashCommandBuilder } = require('discord.js');


initializeApp(key.firebaseConfig);
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
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeoutwithlove')
		.setDescription('Go to Bed!'),
	async execute(interaction) {
		await interaction.reply('Reply!');
	},
};
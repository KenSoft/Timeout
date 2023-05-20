const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kamikaze')
		.setDescription('Good night everyone!')
		.addIntegerOption(option =>
		option.setName('time')
			.setDescription('Time in minute until timeout')
			.setRequired(true)
			// Ensure the text will fit in an embed description, if the user chooses that option
			.setMinValue(0)
			.setMaxValue(1440)),
	async execute(interaction) {
		const time = interaction.options.getInteger('time')
		await interaction.reply(`Reply! ${time}`);
	},

};
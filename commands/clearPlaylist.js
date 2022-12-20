const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { spotifyAuthToken, playlistId } = require('../config.json');

const bearer = 'Bearer ' + spotifyAuthToken;
const playlistUrl = 'https://api.spotify.com/v1/playlists/' + playlistId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear-playlist')
		.setDescription('Clears the configured playlist')
		.addStringOption(option =>
			option
				.setName('description')
				.setDescription('Sets the playlist description')
				.setRequired(false)),
	async execute(interaction) {

		const playlistResponse = await axios.get(playlistUrl, {
			headers: { 'Authorization': bearer },
			responseType: 'json',
		}).catch(err => {
			console.error(err);
		});

		console.log('Playlist\'s OwnerId: ' + JSON.stringify(playlistResponse.data.owner.id));

		return interaction.reply('Playlist cleared!');
	},
};
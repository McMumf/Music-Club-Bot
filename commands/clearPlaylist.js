const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { playlistId, playlistOwnerDiscordId } = require('../config.json');

const playlistUrl = 'https://api.spotify.com/v1/playlists/' + playlistId;

async function removeTracks(playlistResponse, bearer) {
	const playlistItems = playlistResponse.data.tracks['items'];

	let trackUris = {
		'tracks': []
	};

	for (let i in playlistItems) {
		console.debug('Looking at ' + JSON.stringify(playlistItems[i].track));
		trackUris['tracks'].push({ 'uri': playlistItems[i].track.uri });
	}

	console.debug('Track URIs: ' + JSON.stringify(trackUris));

	await axios.delete(playlistUrl + '/tracks', {
		headers: {
			Authorization: bearer,
			'Content-Type': 'application/json'
		},
		data: trackUris
	}).catch(err => {
		console.error(err);
		return;
	});

	console.debug('successfully removed tracks');
}

async function updateDescription(theme, bearer) {
	await axios.put(playlistUrl, { 'description': 'Theme: ' + theme.trim() }, {
		headers: {
			Authorization: bearer,
			'Content-Type': 'application/json'
		}
	}).catch(err => {
		console.error(err);
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear-playlist')
		.setDescription('Clears the configured playlist')
		.addStringOption(option =>
			option
				.setName('theme')
				.setDescription('Sets the playlist description')
				.setRequired(false)),
	async execute(interaction) {

		const newToken = 'AQCAtt9F_V9IIPK2WUx_3sbgJZPJc63pu-pZQWM7rku9j0rQOvUeozohZYUU7nJUfzAIMGJMl-Gh4IrFlXeivOVgbdSB9Hnqfi2TqJTVaVWR29Q9dnzRQZeUUHeqC08AoLg_VRq9ElCqEfLqRCY4H10fS6VvagNcHsxs6fxczTFtg3hwdYPV826lwA5jbGVl32pTwthhIvSXFlkLmLTiWmkVJtWrcrBTq--GVoECfJFy'; // await spotifyUtils.getSpotifyAccessToken();

		// TODO: Verify user auth (https://developer.spotify.com/documentation/general/guides/authorization/code-flow/)
		// spotifyUtils.userAuth();

		const bearer = 'Bearer ' + newToken;

		const userId = interaction.user.id;

		console.debug('ownerId: ' + userId);

		if (userId !== playlistOwnerDiscordId) {
			return interaction.reply('Only the defined user can clear the playlist.');
		}

		const playlistResponse = await axios.get(playlistUrl, {
			headers: {
				Authorization: bearer
			},
			responseType: 'json'
		}).catch(err => {
			console.error(err);
		});

		await removeTracks(playlistResponse, bearer);

		const newTheme = interaction.options.getString('theme');

		if (typeof newTheme === 'string' && newTheme.trim().length > 0) {
			await updateDescription(newTheme.trim(), bearer);
		}

		return interaction.reply('Playlist cleared!');
	}
};
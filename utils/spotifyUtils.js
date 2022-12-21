const axios = require('axios');
const { spotifyClientId, spotifyClientSecret } = require('../config.json');

const tokenUrl = 'https://accounts.spotify.com/api/token';

async function getSpotifyAccessToken() {

	console.debug('trying to get new token');

	const requestParams = new URLSearchParams();
	requestParams.append('grant_type', 'client_credentials');
	requestParams.append('scope', 'playlist-modify-public playlist-modify-private');

	const tokenResponse = await axios.post(tokenUrl, requestParams, {
		headers: {
			Authorization: 'Basic ' + Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).catch(err => {
		console.error(err);
	});

	console.debug('TOKEN DATA: ' + JSON.stringify(tokenResponse.data));

	return tokenResponse.data.access_token;

}

module.exports = {
	getSpotifyAccessToken,
	userAuth,
};

const axios = require('axios');

const authServerUrl = 'http://localhost:8888';

async function getSpotifyAccessToken() {

	console.debug('trying to get new token');

	const response = await axios.get(authServerUrl + '/get-token').catch(err => {
		console.error('Error receiving token: ' + err);
	});

	console.debug('sending access token: ' + JSON.stringify(response.data));

	return response.data;

}

async function refreshSpotifyAccessToken() {

	console.debug('trying to refresh access toke');

}

module.exports = {
	getSpotifyAccessToken,
	refreshSpotifyAccessToken
};

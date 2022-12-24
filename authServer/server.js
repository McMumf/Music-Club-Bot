/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express'); // Express web server framework
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const { spotifyClientId, spotifyClientSecret } = require('../config.json');

var host = 'http://localhost:8888';

var redirect_uri = host + '/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

app.get('/login', function (req, res) {

	console.debug('user requesting login');

	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	// your application requests authorization
	var scope = 'playlist-modify-public playlist-modify-private';

	const requestParams = new URLSearchParams();
	requestParams.append('response_type', 'code');
	requestParams.append('client_id', spotifyClientId);
	requestParams.append('scope', scope);
	requestParams.append('redirect_uri', redirect_uri);
	requestParams.append('state', state);

	res.redirect('https://accounts.spotify.com/authorize?' + requestParams);
});

app.get('/callback', async function (req, res) {

	// your application requests refresh and access tokens
	// after checking the state parameter

	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		if (state === null) console.error('Received a null state');
		if (state !== storedState) console.error('Received a state that doesn\'t match');
		res.redirect('/#' +
			querystring.stringify({
				error: 'state_mismatch'
			})
		);
	} else {
		console.debug('valid state, moving on');
		res.clearCookie(stateKey);

		let errorSentinel = false;

		const requestParams = new URLSearchParams();
		requestParams.append('code', code);
		requestParams.append('redirect_uri', redirect_uri);
		requestParams.append('grant_type', 'authorization_code');

		const response = await axios.post('https://accounts.spotify.com/api/token', requestParams, {
			headers: {
				'Authorization': 'Basic ' + Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			json: true
		}).catch(err => {
			console.error(err);
			errorSentinel = true;
		});

		console.debug('login response: ' + JSON.stringify(response.data));

		if (!errorSentinel && response.data) {

			console.debug('valid response, return redirecting');

			var access_token = response.data.access_token,
				refresh_token = response.data.refresh_token;

			await axios.get('https://api.spotify.com/v1/me', {
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			});

			res.send({
				access_token: access_token,
				refresh_token: refresh_token
			});
		} else {
			console.debug('invalid response');
			res.send('invalid_request');
		}
	}
});

app.get('/refresh_token', async function (req, res) {

	console.debug('refreshing token');

	// requesting access token from refresh token
	var refresh_token = req.query.refresh_token;

	var errorSentinel = false;

	const requestParams = new URLSearchParams();
	requestParams.append('grant_type', 'refresh_token');
	requestParams.append('refresh_token', refresh_token);

	const response = await axios.post('https://accounts.spotify.com/api/token', requestParams, {
		headers: {
			'Authorization': 'Basic ' + Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		json: true
	}).catch(err => {
		console.error(err);
		errorSentinel = true;
	});

	console.log('refresh response: ' + JSON.stringify(response.data));

	if (!errorSentinel && response.data.statusCode) {
		var access_token = response.data.access_token;
		res.send({
			'access_token': access_token
		});
	}

});

console.log('Listening on 8888');
app.listen(8888);

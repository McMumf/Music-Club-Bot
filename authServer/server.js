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

var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

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
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: spotifyClientId,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		})
	);
});

app.get('/callback', async function (req, res) {

	// your application requests refresh and access tokens
	// after checking the state parameter

	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		if (state === null) console.err('Received a null state');
		if (state !== storedState) console.err('Received a state that doesn\'t match');
		res.redirect('/#' +
			querystring.stringify({
				error: 'state_mismatch'
			})
		);
		if (state === null) console.err('Received a null state');
	} else {
		res.clearCookie(stateKey);

		let errorSentinel = false;

		const response = await axios.post('https://accounts.spotify.com/api/token', {
			headers: {
				'Authorization': 'Basic ' + Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64')
			},
			form: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code'
			},
			json: true
		}).catch(err => {
			console.err(err);
			errorSentinel = true;
		});

		if (!errorSentinel && response.statusCode === 200) {

			var access_token = response.data.access_token,
				refresh_token = response.data.refresh_token;

			await axios.get('https://api.spotify.com/v1/me', {
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			});

			// we can also pass the token to the browser to make requests from there
			res.redirect('/#' +
				querystring.stringify({
					access_token: access_token,
					refresh_token: refresh_token
				}));
		} else {
			res.redirect('/#' +
				querystring.stringify({
					error: 'invalid_token'
				}));
		}
	}
});

app.get('/refresh_token', async function (req, res) {

	// requesting access token from refresh token
	var refresh_token = req.query.refresh_token;

	var errorSentinel = false;

	const response = await axios.post('https://accounts.spotify.com/api/token', {
		headers: {
			'Authorization': 'Basic ' + Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64')
		},
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	}).catch(err => {
		console.err(err);
		errorSentinel = true;
	});

	if (!errorSentinel && response.statusCode === 200) {
		var access_token = response.data.access_token;
		res.send({
			'access_token': access_token
		});
	}

});

console.log('Listening on 8888');
app.listen(8888);

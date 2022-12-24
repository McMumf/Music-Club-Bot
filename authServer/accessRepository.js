/**
 * Class to persist spotify tokens during run time
 */
class AccessRepository {

	constructor() {
		this.accessToken = '';
		this.refreshToken = '';
	}

	setAccessToken(accessToken) {
		this.accessToken = accessToken;
	}

	setRefreshToken(refreshToken) {
		this.refreshToken = refreshToken;
	}

	getAccessToken() {
		return this.accessToken;
	}

	getRefreshToken() {
		return this.refreshToken;
	}

	/**
	 *
	 * TODO: Refactor to be better than checking for saved values since tokens can expire. Not safe to assume
	 *
	 * @returns true if user already authenticated and items are stored
	 */
	isAuthenticated() {
		let isAuthenticated = false;

		if (this.accessToken !== '' && this.refreshToken !== '') {
			console.debug('access token: ' + this.accessToken);
			console.debug('refresh token: ' + this.refreshToken);
			console.debug('User already logged in');
			isAuthenticated = true;
		}

		console.debug('isAuthenticated: ' + isAuthenticated);

		return isAuthenticated;
	}

}

let accessRepo = new AccessRepository();
module.exports = accessRepo;
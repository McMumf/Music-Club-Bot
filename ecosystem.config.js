module.exports = {
	apps: [{
		script: 'bot/bot.js',
		watch: 'bot',
		env: {
			NODE_ENV: 'development'
		},
		env_production: {
			NODE_ENV: 'production'
		}
	},
	{
		script: 'authServer/server.js',
		watch: 'authServer',
		env: {
			NODE_ENV: 'development'
		},
		env_production: {
			NODE_ENV: 'production'
		}
	}]
};

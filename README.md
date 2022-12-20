# Music-Club-Bot

A Discord bot to help control spotify playlists

## Prequisites

### Discord Tokens

### Spotify Tokens

1) Create an app in dev
2) Add redirect URI
   - Ex: `https://example.com/callback/`
3) Encode redirect URI
   - Ex: `https%3A%2F%2Fexample.com%2Fcallback%2F`
4) copy and paste the following uri and replace the values into a web broswer
   - Ex: `https://accounts.spotify.com/authorize?client_id=<YOUR CLIENT ID>&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback%2F&scope=user-read-private%20user-read-email&response_type=token&state=123`
5) Get token

## Building and Deploying

1) Get Discord Tokens
   - Bot Token
   - Client Token
   - Guild Token
2) Replace the values in `bot/config.json` with the previous step's values
3) Build the docker image: `docker build . -t <your_user>/music-club-bot`
4) Run the image: `docker run -d <your_user>/music-club-bot`

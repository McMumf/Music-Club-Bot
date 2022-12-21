# Music-Club-Bot

A Discord bot to help control spotify playlists

## Prequisites

## Building and Deploying

1) Get Discord Tokens
   - Bot Token
   - Client Token
   - Guild Token
   - User ID
2) Get Spotify Tokens
   - Client ID
   - Client Secret
   - Playlist ID
3) Create `config.json`
4) Enter information

   ```json
   {
      "clientId": "<DISCORD CLIENT ID>",
      "guildId": "<DISCORD GUILD TOKEN>",
      "token": "<DISCORD BOT TOKEN>",
      "spotifyClientId": "<SPOTIFY APP CLIENT ID>",
      "spotifyClientSecret": "<SPOTIFY APP CLIENT SECRET>",
      "playlistId": "<SPOTIFY PLAYLIST ID",
      "playlistOwnerDiscordId": "<USER DISCORD ID>"
   }
   ```

5) Build the docker image: `docker build . -t <your_user>/music-club-bot`
6) Run the image: `docker run -d <your_user>/music-club-bot`

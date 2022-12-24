# Music-Club-Bot

A Discord bot to help control spotify playlists

## Prerequisites

- Discord Tokens
  - Bot Token
  - Client Token
  - Guild Token
  - User ID
- Spotify Tokens
  - Client ID
  - Client Secret
  - Playlist ID

## Building and Deploying

1) Create `config.json`
2) Enter information

    ```json
    {
      "clientId": "<DISCORD CLIENT ID>",
      "guildId": "<DISCORD GUILD ID>",
      "token": "<DISCORD BOT TOKEN>",
      "spotifyClientId": "<SPOTIFY APP CLIENT ID>",
      "spotifyClientSecret": "<SPOTIFY APP CLIENT SECRET>",
      "playlistId": "<SPOTIFY PLAYLIST ID",
      "playlistOwnerDiscordId": "<USER DISCORD ID>"
    }
    ```

3) Build the docker image: `docker build . -t <your_user>/music-club-bot`
4) Run the docker image: `docker run -p 8888:8888 -d <your_user>/music-club-bot`

## Guides

- [Retrieving Discord Tokens](#)
- [Retrieving Spotify Tokens](#)

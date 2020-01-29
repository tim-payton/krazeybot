# krazeybot

Very quick guide for run time:

- Setup an .env file within your application folder. This will need the following:
  DISCORD_BOT_KEY=<KEY>
  AUDIO_PATH=<PATH>
  TWITCH_CHANNEL=<CHANNEL>
  TWITCH_USER=<USERNAME>
  TWITCH_OAUTH=<OAUTH>
- You need to install ffmpeg for sound commands to work, is suggest using chocolatey if you're on windows: https://chocolatey.org/packages/ffmpeg

- There isn't a quick way setup to run this yet so just run via node src/index.js

Code is very rough whilst trying out ideas! Please raise issues if you find them.

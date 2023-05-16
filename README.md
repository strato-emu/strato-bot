# Strato Bot

We needed a bot for managing our Discord server with specific features. Strato Bot was created so that we could effectively moderate and help people in an efficient manner and meet the special needs of managing an emulation server with potential for integration with the application in the future.

Strato Bot is forked from [Skyline Bot](https://github.com/skyline-emu/skyline-bot).

## Outline

### Events

These are any events emitted by the Discord API that are visible to the bot, such as:

- Triggering an interaction (`interactionCreate`)
- Successful connection with the Discord API (`ready`)
- Sending a message (`messageCreate`)
- Modification of a guild member (`guildMemberUpdate`)

### Filters

These are implemented in the `messageCreate` event file. The functions added are run for every message that the bot recieves.

### Commands

Strato Bot uses Discord interactions (slash commands, modals, etc.) to provide users with a simple way of communicating with the bot.

## Setup and usage

### Step 1: Install Node.js

We use Discord.js for writing the bot, a module that allows the bot to connect with the Discord API through Node.js. Install Node.js to develop or host an instance of Strato Bot.

### Step 2: Installing modules and dependencies

Download the code and extract it to a folder. Run `npm i` from inside the project folder to install the necessary modules and dependencies that allow Strato Bot to run.

### Step 3: Starting the bot

To start the bot, run `npm run tscw`. This is a script that will allow users to make changes to the code that will be detected and recompiled as they are made.

### Step 4: Deploy commands

Anytime a command's `data` property is modified or a new command is created, use `npm run update` to update the command list.

## Docker Support

Docker packages can be created and run using Github workflows. Run the Docker images by downloading the package, cloning the .env file in the source code, and doing `docker run --env-file <.env file name> <Docker image name>`.

## Notes

- Strato Bot is written in TypeScript to allow for compile-time error checking. Strato Bot is also written completely using the ECMAScript standard for added concision and convenience.
- To set command permissions beyond the defaults, you'll need to edit them in server settings.

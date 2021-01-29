# New Suggestion Bot
[![release](https://img.shields.io/badge/release-v2.3.0-green.svg?style=flat)]()
[![license](https://img.shields.io/github/license/s0ftik3/newsuggestion-bot)]()
[![size](https://img.shields.io/github/languages/code-size/s0ftik3/newsuggestion-bot)]()

Telegram description: Suggest new features for Telegram.

## About
The bot is created for those people who still don't have an access to create cards on bugs.telegram.org or who want to publish their idea on this platform anonymously. 

## In progress
![commands](https://i.ibb.co/hcLjtKH/1.png)
![start](https://i.ibb.co/dPMnzy4/2.png)
![app](https://i.ibb.co/B37kST0/3.png)
![submit](https://i.ibb.co/fGN4JnV/4.png)
![published](https://i.ibb.co/gvVhWBp/5.png)
![me](https://i.ibb.co/ngRmKsn/6.png)

## Creating your bot
1) Create your own bot using [Bot Father](https://t.me/BotFather) and copy your brand-new bot's token.
2) Paste the token in `config.js`. Replace `process.env.TOKEN` (2nd line) to your token.
3) The bot uses MongoDB. If you use another database providing platform, you should rewrite the code a little bit. However, if you use MongoDB as well as me, just replace `process.env.DATABASE` to your database URL in `config.js` (3d line).
4) Once you've done all those steps, you can launch your bot `node index.js` and enjoy it!

## Credits
- Author [s0ftik3](https://github.com/s0ftik3)
- Author on [Telegram](https://t.me/id160)
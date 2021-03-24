# New Suggestion Bot
[![release](https://img.shields.io/badge/release-v3.8.3-green.svg?style=flat)]()
[![license](https://img.shields.io/github/license/s0ftik3/newsuggestion-bot)]()
[![size](https://img.shields.io/github/languages/code-size/s0ftik3/newsuggestion-bot)]()
[![Crowdin](https://badges.crowdin.net/newsuggestion-bot/localized.svg)](https://crowdin.com/project/newsuggestion-bot)

![preview](https://i.ibb.co/yk0PMp5/preview.png)

## About
Create, edit, remove and follow your cards on bugs.telegram.org directly from Telegram app. The bot allows you to create cards on the platform anonymously. It's perfect for you if you don't want to leave Telegram application but have plenty of ideas to suggest.

## Features compatibility
* Create suggestion card. ✅
* Receive feedback from created cards. (comments) ✅
* Edit created cards. ✅
* Delete created cards. ✅
* Formatting support. (bold, italic, code, all headers) ✅
* View list of created cards. ✅
* Media attach support. ✅
* Cards search. ✅
* Auto-translation to English. ✅
* Albums attach support. ❌

## Creating your bot
1) Create your own bot using [Bot Father](https://t.me/BotFather) and copy your brand-new bot's token.
2) Paste the token in `config.js`. Replace `process.env.TOKEN` (2nd line) to your token.
3) The bot uses MongoDB. If you use another database providing platform, you should rewrite the code a little bit. However, if you use MongoDB as well as me, just replace `process.env.DATABASE` to your database URL in `config.js` (3d line).
4) Replace `process.env.ADMIN` (4th line) to your Telegram ID. (you can get it via [@userinfobot](https://t.me/userinfobot))
5) Replace `process.env.CHAT` to your public chat's username. (it's required because new suggestions will be published there too)
6) Replace `process.env.NUMBER` to your phone number that will be used to login on the platform.
4) Once you've done all those steps, you can launch your bot `node index.js` and enjoy it!

## Credits
* [Bugs and Suggestions platform](https://bugs.telegram.org)
* Author on [Telegram](https://t.me/id160)
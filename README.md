# New Suggestion Bot
[![release](https://img.shields.io/badge/release-v3.4.4-green.svg?style=flat)]()
[![license](https://img.shields.io/github/license/s0ftik3/newsuggestion-bot)]()
[![size](https://img.shields.io/github/languages/code-size/s0ftik3/newsuggestion-bot)]()
[![Crowdin](https://badges.crowdin.net/newsuggestion-bot/localized.svg)](https://crowdin.com/project/newsuggestion-bot)

Telegram description: Suggest new features for Telegram.

## About
The bot is created for those people who still don't have an access to create cards on bugs.telegram.org or who want to publish their idea on this platform anonymously. 

## In progress
<table>
  <tr>
      <td>
        <img src="https://i.ibb.co/MM8Bf7n/1.png" alt="Main menu">
        <img src="https://i.ibb.co/vZJ514Y/2.png" alt="App choose">
        <img src="https://i.ibb.co/wg38ZpD/3.png" alt="Title">
      </td>
      <td>
        <img src="https://i.ibb.co/hXqpN7B/4.png" alt="Check">
        <img src="https://i.ibb.co/ysSwZhq/5.png" alt="Preview">
        <img src="https://i.ibb.co/84q4T1h/6.png" alt="Published">
      </td>
  </tr> 
</table>

## Creating your bot
1) Create your own bot using [Bot Father](https://t.me/BotFather) and copy your brand-new bot's token.
2) Paste the token in `config.js`. Replace `process.env.TOKEN` (2nd line) to your token.
3) The bot uses MongoDB. If you use another database providing platform, you should rewrite the code a little bit. However, if you use MongoDB as well as me, just replace `process.env.DATABASE` to your database URL in `config.js` (3d line).
4) Once you've done all those steps, you can launch your bot `node index.js` and enjoy it!

## Credits
- [Bugs & Suggestions platform](https://bugs.telegram.org)
- Author on [Telegram](https://t.me/id160)
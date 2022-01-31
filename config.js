require('dotenv').config()

module.exports = {
  user: {
    id: 519714980
  },
  bot: {
    token: process.env.TELEGRAM_BOT_TOKEN
  },
  trello: {
    apiKey: process.env.TRELLO_API_KEY,
    accessToken: process.env.TRELLO_ACCESS_TOKEN
  }
}
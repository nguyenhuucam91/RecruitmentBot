const fs = require('fs');
const fetch = require('node-fetch');
const config = require('../config')

const TrelloService = {
  getListFromChatId: (chatId) => {
    try {
      const listId = fs.readFileSync(`chatroom/${chatId}.txt`)
      return listId;
    } catch (e) {
      console.log(e);
    }
  },

  createCard: async (listId, params) => {
    const { username } = params
    try {
      const fetchRequest = await fetch(
        `https://api.trello.com/1/cards?idList=${listId}&key=${config.trello.apiKey}&token=${config.trello.accessToken}&name=${username}`, 
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          }
        });
      const data = await fetchRequest.json()
      const status = fetchRequest.status
      return {
        status,
        data
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = TrelloService
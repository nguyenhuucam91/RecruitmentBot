const fs = require('fs')

const MustHaveTrelloListId = (ctx, next) => {
  const chatId = ctx.chat.id
  try {
    fs.readFileSync(`chatroom/${chatId}.txt`)
  } catch (e) {
    return ctx.reply('Không tìm thấy chat id. Nhập /tlistid <listid> để thêm mới trello list id');
  }

  return next()
}

module.exports = MustHaveTrelloListId
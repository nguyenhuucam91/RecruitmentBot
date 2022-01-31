const {Telegraf, Markup} = require('telegraf')
const config = require('../config')
const TrelloService = require('./trelloService')

const bot = new Telegraf(config.bot.token)

const InterviewResponse = {
  start: async (ctx) => {
      let message = `Nhập Trello List Id. Nhập /tlistid <trello list id> để nhập id của list cần thêm`
      return ctx.reply(message)
  },

  hear: async (ctx) => {
    const candidateCheckRegex = /thông tin ứng viên | số năm kinh nghiệm/i
    if (ctx.message.hasOwnProperty('document') && candidateCheckRegex.test(ctx.update.message.caption)) {
      const candidateName = ctx.message.document.file_name.split('.')[0]
      await bot.telegram.sendMessage(ctx.chat.id, `[camnh](tg://user?id=${config.user.id})`, {parse_mode: 'Markdown'})
      const res = await ctx.replyWithHTML(
        `Bạn có đồng ý đặt lịch phỏng vấn bạn <b>${candidateName}</b> không`,
        Markup.inlineKeyboard([
          Markup.button.callback('Đồng ý', 'accept'),
          Markup.button.callback('Từ chối', 'reject')
        ])
      );
      messageId = res.message_id
    }
  },

  accept: async (ctx) => {
    const response = ctx.update.callback_query.message.text
    const regex = /Bạn có đồng ý đặt lịch phỏng vấn bạn (.+) không/
    const user = response.match(regex)
    let messageId = ctx.update.callback_query.message.message_id
    if (user.length > 0) {
      const username = user[1]
      //call api for trello
      ctx.replyWithHTML(`Bạn đã đồng ý phỏng vấn bạn <b>${username}</b>`)
      const listId = TrelloService.getListFromChatId(ctx.chat.id)
      const res = await TrelloService.createCard(listId, {
        username
      })
      if (res.status >= 200 && res.status <= 300) {
        await ctx.reply(`Trello card đã được tạo cho <b>${username}</b>`)
      }
      await bot.telegram.deleteMessage(ctx.chat.id, messageId)
    }
  },

  reject: async (ctx) => {
    const response = ctx.update.callback_query.message.text
    const regex = /Bạn có đồng ý đặt lịch phỏng vấn bạn (.+) không/
    const user = response.match(regex)
    let messageId = ctx.update.callback_query.message.message_id
    if (user.length > 0) {
      //call api for trello
      ctx.replyWithHTML(`Bạn đã từ chối phỏng vấn bạn <b>${user[1]}</b>`)
      await bot.telegram.deleteMessage(ctx.chat.id, messageId)
    }
  }
}

module.exports = InterviewResponse
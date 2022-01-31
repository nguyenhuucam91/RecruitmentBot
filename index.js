const {Telegraf} = require('telegraf');
const config = require('./config');
const InterviewResponse = require('./services/interviewResponse');
const fs = require('fs');
const MustHaveTrelloListId = require('./middlewares/MustHaveTrelloListId');

const bot = new Telegraf(config.bot.token)

bot.start(ctx => InterviewResponse.start(ctx))

bot.command('tlistid', (ctx) => {
    const chatId = ctx.chat.id
    if (ctx.hasOwnProperty('update')) 
    {
        const text = ctx.message.text || ctx.edited_message.text || ctx.callback_query.text || ctx.update.message.text
        const matches = text.match(/TListId (\w+)?/i)
        if (matches) {
            const listId = matches[1]
            ctx.state.listId = listId
            fs.writeFileSync(`chatroom/${chatId}.txt`, listId)
            return ctx.reply('Trello list id là ' + listId)
        } 
    } else {
        return ctx.reply('Thiếu trello list id. Gõ /tlistid <listid> để nhập trello list id')
    }
});

bot.on('message', MustHaveTrelloListId, InterviewResponse.hear)

bot.action('accept',  MustHaveTrelloListId, InterviewResponse.accept)

bot.action('reject', MustHaveTrelloListId, InterviewResponse.reject)

bot.launch()
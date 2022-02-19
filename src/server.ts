import app from './app'
import Client from './client'

const bot = new Client()

/**
 * add/update the given messages. If they were received while the connection was online,
 * the update will have type: "notify"
 *  */

bot.sock.ev.on('messages.upsert', async message => {
  bot.message = message

  const { messages, type } = bot.message
  const msg = messages[0]

  if (!msg.key.fromMe && type === 'notify') {
    console.log('replying to', messages[0].key.remoteJid)
    await bot.sock.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])
    await bot.sendMessageWTyping(msg.key.remoteJid, { text: 'Hello there!' })
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('⚡ App listening on port', port)
})

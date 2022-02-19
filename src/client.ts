import WAConnection from './WAConnection'
import { WAMessage, BaileysEventMap, AuthenticationCreds, AnyMessageContent, MiscMessageGenerationOptions, delay } from '@adiwajshing/baileys'

class Client extends WAConnection {
  public message: BaileysEventMap<AuthenticationCreds>['messages.upsert']

  public async sendMessageWTyping (
    remoteJid: string,
    content: AnyMessageContent,
    options?: MiscMessageGenerationOptions
  ): Promise<WAMessage> {
    await this.sock.presenceSubscribe(remoteJid)
    await delay(500)
    await this.sock.sendPresenceUpdate('composing', remoteJid)
    await delay(2000)
    await this.sock.sendPresenceUpdate('paused', remoteJid)
    return await this.sock.sendMessage(remoteJid, content, options)
  }
}

export default Client

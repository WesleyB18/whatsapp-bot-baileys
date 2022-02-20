import WAConnection from './WAConnection'
import {
  WAMessage,
  BaileysEventMap,
  AuthenticationCreds,
  AnyMessageContent,
  MiscMessageGenerationOptions,
  delay
} from '@adiwajshing/baileys'

declare type Messages<Creds> = {
  set?: BaileysEventMap<Creds>['messages.set'];
  delete?: BaileysEventMap<Creds>['messages.delete'];
  update?: BaileysEventMap<Creds>['messages.update'];
  upsert?: BaileysEventMap<Creds>['messages.upsert'];
}

class Client extends WAConnection {
  public messages: Messages<AuthenticationCreds>

  constructor () {
    super()
    this.messages = {}
  }

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

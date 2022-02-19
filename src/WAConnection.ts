import makeWASocket, { DisconnectReason, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'

class WAConnection {
  private store: ReturnType<typeof makeInMemoryStore>
  public sock: ReturnType<typeof makeWASocket>

  constructor () {
    this.makeMemoryStorage()
    this.connectToWhatsApp()
  }

  private makeMemoryStorage (): void {
    // The store maintains the data of the WA connection in memory.
    // Can be written out to a file & read from it.
    this.store = makeInMemoryStore({
      logger: pino().child({ level: 'debug', stream: 'store' })
    })
    // Can be read from a file.
    this.store.readFromFile('./baileys_store_multi.json')
    // Saves the state to a file every 10s.
    setInterval(() => {
      this.store.writeToFile('./baileys_store_multi.json')
    }, 10000)
  }

  private connectToWhatsApp (): void {
    // Utility function to help save the auth state in a single file.
    // It's utility ends at demos -- as re-writing a large file over and over again is very inefficient.
    const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')
    // Will use the given state to connect.
    // So if valid credentials are available -- it'll connect without QR.
    this.sock = makeWASocket({
      logger: pino({ level: 'trace' }),
      printQRInTerminal: true,
      version: [2, 2204, 13],
      auth: state
    })
    // Will listen from this socket.
    // The store can listen from a new socket once the current socket outlives its lifetime.
    this.store.bind(this.sock.ev)
    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
        // Reconnect if not logged out.
        if (shouldReconnect) {
          this.connectToWhatsApp()
        }
      } else if (connection === 'open') {
        console.log('opened connection')
      }
    })
    // This will be called as soon as the credentials are updated.
    this.sock.ev.on('creds.update', saveState)
  }
}

export default WAConnection

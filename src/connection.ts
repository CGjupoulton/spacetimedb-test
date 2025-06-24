import { Identity } from "@clockworklabs/spacetimedb-sdk"
import { DbConnection, ErrorContext } from "./module_bindings"

interface State {
  connected: boolean
  identity: Identity|null
  conn: DbConnection|null
}

export const state: State = {
  connected: false,
  identity: null,
  conn: null
}

async function init(): Promise<void>  {
    const prom = new Promise<void>((resolve, reject) => {
    const subscribeToQueries = (conn: DbConnection, queries: string[]) => {
      conn
        ?.subscriptionBuilder()
        .onApplied(() => {
          console.log('SDK client cache initialized.')
          resolve()
        })
        .subscribe(queries)
    }

    const onConnect = (
      conn: DbConnection,
      identity: Identity,
      token: string
    ) => {
      state.identity = identity
      state.connected = true
      localStorage.setItem('auth_token', token)
      console.log(
        'Connected to SpacetimeDB with identity:',
        identity.toHexString()
      )

      subscribeToQueries(conn, 
        [
          'SELECT * FROM user',
          'SELECT * FROM steve',
          'SELECT * FROM food'
        ]
      )
    }

    const onDisconnect = () => {
      console.log('Disconnected from SpacetimeDB')
      state.connected = false
    }

    const onConnectError = (_ctx: ErrorContext, err: Error) => {
      console.log('Error connecting to SpacetimeDB:', err)
      reject('Error connecting to SpacetimeDB')
    }

    state.conn = 
      DbConnection.builder()
        // .withUri('wss://5d3a-109-205-6-57.ngrok-free.app')
        // .withUri('ws://localhost:3000')
        .withUri('wss://maincloud.spacetimedb.com')
        .withModuleName('steve-mmo')
        .withToken(localStorage.getItem('auth_token') || '')
        .onConnect(onConnect)
        .onDisconnect(onDisconnect)
        .onConnectError(onConnectError)
        .build()
  })
  return prom
}



export async function connect() {
  await init()
}
  
import { Client } from 'discord.js'

/**
 * A project-wide container for a Discord client.
 */
export default class DiscordSvc {
    private static _Client: Client

    static get client(): DiscordSvc {
        return this._Client || (this._Client = new Client())
    }
}

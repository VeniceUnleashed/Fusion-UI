export function getServerPlayers(server) {
    return server.variables.players ? server.variables.players : server.players;
}
export function getServerSpectators(server) {
    const spectatorsNum = parseInt(server.variables.spectators, 10);

    return !isNaN(spectatorsNum) ? spectatorsNum : 0;
}

export function getServerPlayers(server) {
    const players = server.variables.players ? server.variables.players : server.players;
    const playersNum = parseInt(players, 10);

    return !isNaN(playersNum) ? playersNum : 0;
}

export function getServerPlayersOnly(server) {
    return getServerPlayers(server) - getServerSpectators(server);
}
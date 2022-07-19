export function getServerSpectators(server) {
    const spectatorsNum = parseInt(server.variables.spectators, 10);

    return !isNaN(spectatorsNum) ? spectatorsNum : 0;
}

export function getServerPlayersOnly(server) {
    if (server.variables.players) {
        const playersNum = parseInt(server.variables.players, 10);

        if (!isNaN(playersNum)) {
            return playersNum;
        }
    }

    const playersNum = parseInt(server.players);

    const playersCount = !isNaN(playersNum) ? playersNum : 0;

    const spectatorsCount = getServerSpectators(server);

    return playersCount - spectatorsCount;
}
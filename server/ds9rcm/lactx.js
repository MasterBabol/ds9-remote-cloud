
const contextCreator = (laInfo, connectedSocket) => ({
    id: laInfo.id,
    socket: connectedSocket,
    recentSignals: [],
    recentTechnologies: []
});

export default contextCreator;

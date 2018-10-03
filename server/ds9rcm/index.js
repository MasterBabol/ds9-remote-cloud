import fs from 'fs';

import low from 'lowdb';
import fsync from 'lowdb/adapters/FileSync';

import LocalAgentContext from './lactx';

const adapter = new fsync('db.json');
const db = low(adapter);
db.defaults({
    'local-agents': [],
    'cloud-inventory': []
}).write();

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const inst = function(sockio) {
    ds9Init(sockio);

    setInterval(ds9Periodical, 1000);

    return function(req, _, next) {
        next();
    };
}

let io = null;
let connectedLocalAgents = [];

JSON.tryParse = function(raw) {
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function ds9Init(sockio) {
    io = sockio;

    sockio.on('connection', function(socket) {
        socket.on('auth', function(data) {
            let laInfo = db.get('local-agents').find({secretKey: data}).value();
            if (laInfo) {
                let laCtx = LocalAgentContext(laInfo, socket);
                connectedLocalAgents[laInfo.id] = laCtx

                console.log('[+] A local agent has been connected and authorized: ' + laInfo.id);

                socket.on('getItems', function(data) {
                    ds9HandleGetItems(laCtx, JSON.tryParse(data));
                });

                socket.on('putItems', function(data) {
                    ds9HandlePutItems(laCtx, JSON.tryParse(data));
                });

                socket.on('registerSignals', function(data) {a
                    ds9HandleRegisterSignals(laCtx, JSON.tryParse(data));
                });

                socket.on('registerTechnologies', function(data) {
                    ds9HandleRegisterTechnologies(laCtx, JSON.tryParse(data));
                });

                socket.on('disconnect', function() {
                    delete localAgents[laInfo.id];
                    console.log('[-] A local agent has been disconnected: ' + laInfo.id);
                    socket.disconnect();
                });

                socket.on('forceDisconnect', function() {
                    delete localAgents[laInfo.id];
                    console.log('[-] A local agent has been disconnected (force): ' + laInfo.id);
                });

                socket.removeAllListeners('auth');
            } else {
                console.log('[-] A socket client has failed to authorize: ' + socket.id);
                socket.disconnect();
            }
        });
    });
}

function ds9HandleGetItems(laCtx, data)
{
    let cinv = db.get('cloud-inventory').value();
    if (cinv == undefined)
        cinv = [];
    let withdrawnItems = [];


    
    laCtx.emit('getItemsResponse', withdrawnItems);
}

function ds9HandlePutItems(laCtx, data)
{
}

function ds9HandleRegisterSignals(laCtx, data)
{
}

function ds9HandleRegisterTechnologies(laCtx, data)
{
}

function ds9Periodical() {
}

export default inst;

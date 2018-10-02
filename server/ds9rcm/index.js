import low from 'lowdb';
import fsync from 'lowdb/adapters/FileSync';

const adapter = new fsync('db.json');
const db = low(adapter);

const inst = function(sockio) {
    setTimeout(ds9_bootstrap, 1000);

    sockio.on('connection', function(socket) {
        console.log('[+] A client connected: ' + socket.id);

        socket.on('disconnect', function() {
            console.log('[-] A client has been disconnected ' + socket.id);
            socket.disconnect();
        });

        socket.on('forceDisconnect', function() {
            console.log('[-] A client has been disconnected (force)' + socket.id);
        });
    });

    return function(req, _, next)
    {
        next();
    };
}

function ds9_bootstrap()
{
    ds9_background_handler();
    setTimeout(ds9_bootstrap, 1000);
}

function ds9_background_handler()
{
}

export default inst;

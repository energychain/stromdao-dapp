 var startStopDaemon = require('start-stop-daemon');
startStopDaemon(function() {
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({     
    port: 8089 
});

server.register({
    register: require('h2o2')
}, function (err) {

    if (err) {
        console.log('Failed to load h2o2');
    }
	server.route({
		method: 'POST',
		path: '/rpc',
		handler: {
			proxy: {
				host: 'demo.stromdao.de',
				port: '443',
				protocol: 'https',
				passThrough: true,
				xforward: true
			}
		}
	});    
});

server.register(
	require('inert'), (err) => {

    if (err) {
        throw err;
    }

	server.route({
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: 'StromDAO-Browser/'
			}
		}
	});
	
	});
	
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
});

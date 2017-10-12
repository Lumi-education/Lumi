import * as httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
	// proxyReq.setHeader('X-Auth-CouchDB-UserName', req.user.name);
	// proxyReq.setHeader('X-Auth-CouchDB-Roles', req.user.roles ? req.user.roles.reduce((p,c) => p+c+',','') : '');
	// proxyReq.setHeader('X-Auth-CouchDB-Token', '212c0eee09ccb501aebdf8ec799cdec5');
});

export default proxy;
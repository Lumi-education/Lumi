import * as httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});

proxy.on('error', (error, req, res) => {
    res.status(404).end();
});
export default proxy;

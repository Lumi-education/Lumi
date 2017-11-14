import * as httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});

export default proxy;
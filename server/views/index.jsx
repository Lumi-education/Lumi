var React = require('react');

export default class Index extends React.Component {
    render() {
        return (
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <script type="text/javascript" src="/static/raven.min.js" />
                    <script
                        dangerouslySetInnerHTML={{
                            __html:
                                'Raven.config("' +
                                process.env.SENTRY_PUBLIC +
                                '", {release: "' +
                                process.env.VERSION +
                                '",environment: "' +
                                process.env.NODE_ENV +
                                '",tags: {component: "client", "lumi_id": ' +
                                process.env.LUMI_ID +
                                '},autoBreadcrumbs: true}).install();'
                        }}
                    />

                    <title>Lumi</title>
                </head>

                <body style={{ margin: '0px', background: '#f1f3f4' }}>
                    <div id="lumi" />
                    <script type="text/javascript" src="/vendor.js" />
                    <script type="text/javascript" src="/client.js" />
                </body>
            </html>
        );
    }
}

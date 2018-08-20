var React = require('react');

export default class H5P extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <link rel="stylesheet" href="/static/h5p/styles/h5p.css" />
                    <script src="/static/h5p/js/jquery.js" />
                    <script src="/static/h5p/js/h5p.js" />
                    <script
                        dangerouslySetInnerHTML={{
                            __html:
                                'window.H5PIntegration = parent.H5PIntegration || ' +
                                JSON.stringify(this.props.integration)
                        }}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: 'window.H5PIntegration.contents = {}'
                        }}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html:
                                "window.H5PIntegration.contents['cid-" +
                                this.props.content_id +
                                "'] = " +
                                JSON.stringify(this.props.content)
                        }}
                    />
                    <script src="/static/h5p/js/h5p-event-dispatcher.js" />
                    <script src="/static/h5p/js/h5p-x-api-event.js" />
                    <script src="/static/h5p/js/h5p-x-api.js" />
                    <script src="/static/h5p/js/h5p-content-type.js" />
                    <script src="/static/h5p/js/h5p-action-bar.js" />{' '}
                    {this.props.styles.map(style => (
                        <link key={style} rel="stylesheet" href={'' + style} />
                    ))}
                    {this.props.scripts.map(script => (
                        <script key={script} src={'' + script} />
                    ))}
                </head>
                <body>
                    <div
                        className="h5p-content"
                        data-content-id={this.props.content_id}
                    />
                </body>
                <script src="/static/h5p/js/h5p-resizer.js" />
            </html>
        );
    }
}

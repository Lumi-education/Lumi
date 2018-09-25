import * as React from 'react';
import raven from 'lib/core/raven';

import markdown from '../markdown';

import 'markdown-it-latex/dist/index.css';

interface IProps {
    markdown: string;
    ref_id: string; // needed to convert the files url
}

export default class MarkdownComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        try {
            let text;
            if (this.props.markdown) {
                text = this.props.markdown.replace(
                    /\.\//g,
                    '/files/' + this.props.ref_id + '/'
                );
            } else {
                text = undefined;
            }

            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: markdown.render(text || '# No markdown')
                    }}
                />
            );
        } catch (error) {
            raven.captureException(error);
        }
    }
}

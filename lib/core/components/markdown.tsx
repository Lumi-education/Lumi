import * as React from 'react';
import raven from 'lib/core/raven';

import markdown from '../markdown';
import { convert_files_url } from '../utils';
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
            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: markdown.render(
                            convert_files_url(
                                this.props.markdown,
                                this.props.ref_id
                            ) || '# No markdown'
                        )
                    }}
                />
            );
        } catch (error) {
            raven.captureException(error);
        }
    }
}

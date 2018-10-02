import * as React from 'react';

import markdown from 'lib/core/markdown';

import * as Cards from '../';

import 'markdown-it-latex/dist/index.css';

interface IProps {
    markdown: string;
    card_id: string; // needed to convert the files url
}

export default class MarkdownComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const text = Cards.utils.convert_files_url(
            this.props.markdown,
            this.props.card_id
        );

        return (
            <div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: markdown.render(text || '# No markdown')
                    }}
                />
            </div>
        );
    }
}

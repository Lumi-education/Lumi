import * as React from 'react';
import { connect } from 'react-redux';
import { isEqual, pull, noop } from 'lodash';
import { convert_attachment_url } from '../utils';

import * as markdownit from 'markdown-it';
const md = markdownit();

import Paper from 'material-ui/Paper';
type Markdown = string;

declare var window;

interface IProps {
    _id: string;
    text: Markdown;
    items: Markdown[];
    show_correct_values?: boolean;
    selected_items?: Markdown[];
    cb?: (selected_items: Markdown[], score: number) => void;
}

export default class MultiplechoiceComponent extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    public handleClick(selected_item: string) {
        const newArray = [...this.props.selected_items];
        if (this.props.selected_items.some(item => item === selected_item)) {
            pull(newArray, selected_item);
        } else {
            newArray.push(selected_item);
        }

        const correct_answers = this.props.items.filter(
            i => i.charAt(0) === 'x' || i.charAt(0) === 'X'
        );

        const score = isEqual(newArray.slice(0).sort(), correct_answers.sort())
            ? 1
            : 0;
        this.props.cb ? this.props.cb(newArray, score) : noop();
    }

    public componentDidMount() {
        // window.MathJax.Hub.Typeset();
    }

    public render() {
        const text = convert_attachment_url(this.props.text, this.props._id);

        const items = this.props.items.map(item =>
            convert_attachment_url(item, this.props._id)
        );

        return (
            <div>
                <Paper style={{ padding: '10px' }}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: md.render(text || '# No markdown')
                        }}
                    />
                </Paper>

                {items.map((item, index) => (
                    <Paper
                        key={index}
                        style={{
                            padding: '2px',
                            margin: '10px',
                            backgroundColor: backgroundColor(
                                this.props.show_correct_values || false,
                                item,
                                this.props.selected_items || []
                            )
                        }}
                        onClick={() => this.handleClick(item)}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html:
                                    md.render(
                                        item ? item.replace(/^x |^o /, '') : ''
                                    ) || '# No Markdown'
                            }}
                        />
                    </Paper>
                ))}
            </div>
        );
    }
}

function backgroundColor(
    show_correct_values: boolean,
    item: string,
    selected_items: string[]
): string {
    if (show_correct_values) {
        if (item.charAt(0) === 'x') {
            return '#1abc9c';
        }
        if (item.charAt(0) === 'o') {
            return '#c0392b';
        }
    }
    if (selected_items.indexOf(item) > -1) {
        return '#3498db';
    }
    return '#FFFFFF';
}

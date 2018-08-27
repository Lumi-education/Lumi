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
    text: Markdown;
    items: Markdown[];
    show_correct_values: boolean;
    selected_items: Markdown[];
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
        const text = this.props.text;
        const items = this.props.items;

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
                            backgroundColor:
                                this.props.selected_items.indexOf(item) > -1
                                    ? '#3498db'
                                    : '#ffffff',

                            border: this.props.show_correct_values
                                ? item.charAt(0) === 'x'
                                    ? '3px solid #1abc9c'
                                    : '3px solid #c0392b'
                                : null
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

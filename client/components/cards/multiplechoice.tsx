import * as React from 'react';
import { connect } from 'react-redux';
import { isEqual, pull, noop } from 'lodash';

import * as markdownit from 'markdown-it';
const md = markdownit();

import Paper from 'material-ui/Paper';
type Markdown = string;

interface IProps {
    text: Markdown;
    items: Array<Markdown>;
    show_correct_values?: boolean;
    selected_items?: Array<Markdown>;
    cb?: (selected_items: Array<Markdown>, score: number) => void;
}

interface IState {}

export default class MultiplechoiceCard extends React.Component<
    IProps,
    IState
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

    public render() {
        return (
            <div>
                <Paper style={{ padding: '10px' }}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: md.render(
                                this.props.text || '# No markdown'
                            )
                        }}
                    />
                </Paper>

                {this.props.items.map(item => (
                    <Paper
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
                                    md.render(item.replace(/^x |^o /, '')) ||
                                    '# No Markdown'
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
    selected_items: Array<string>
): string {
    if (show_correct_values) {
        if (item.charAt(0) === 'x') {
            return '#1abc9c';
        }
        if (item.charAt(0) === 'o') {
            return '#c0392b';
        }
        return '#3498db';
    } else {
        if (selected_items.indexOf(item) > -1) {
            return '#3498db';
        } else {
            return '#FFFFFF';
        }
    }
}

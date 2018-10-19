import * as React from 'react';
import { isEqual, pull, noop } from 'lodash';

import Paper from 'material-ui/Paper';

import * as Core from 'lib/core';

interface IProps {
    card_id: string;
    text: string;
    items: string[];
    show_correct_values: boolean;
    selected_items: string[];
    cb?: (selected_items: string[], score: number) => void;
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

    public render() {
        const text = this.props.text;
        const items = this.props.items;

        return (
            <div>
                <Paper style={{ padding: '10px' }}>
                    <Core.components.Markdown
                        ref_id={this.props.card_id}
                        markdown={text}
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
                        <Core.components.Markdown
                            ref_id={this.props.card_id}
                            markdown={
                                item
                                    ? item.replace(/^x |^o /, '')
                                    : '' || '# No Markdown'
                            }
                        />
                    </Paper>
                ))}
            </div>
        );
    }
}

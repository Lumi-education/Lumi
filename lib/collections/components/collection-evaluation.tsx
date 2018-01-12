import * as React from 'react';

import * as markdownit from 'markdown-it';
const md = markdownit();

// components
import Paper from 'material-ui/Paper';

import { get_grade_color } from 'lib/ui/utils';

// types

interface IProps {
    correct: number;
    num: number;
    msg: string;
}

export default class CollectionListComponent extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const percent = this.props.correct / this.props.num * 100;
        return (
            <div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: md.render(this.props.msg || '')
                    }}
                />
                <Paper
                    style={{
                        backgroundColor: get_grade_color(percent)
                    }}
                >
                    {this.props.correct +
                        ' von ' +
                        this.props.num +
                        ' richtig. (' +
                        percent.toFixed(0) +
                        '%)'}
                </Paper>
            </div>
        );
    }
}

import * as React from 'react';

// components
import Paper from 'material-ui/Paper';

import { get_grade_color } from 'client/style/utils';

// types

interface IProps {
    correct: number;
    num: number;
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
            <Paper
                style={{
                    margin: '20px',
                    padding: '10px',
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
        );
    }
}

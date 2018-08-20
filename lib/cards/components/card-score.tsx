import * as React from 'react';
import * as debug from 'debug';

import { Avatar } from 'material-ui';

import { get_grade_color, get_grade_string } from '../../ui/utils';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    score: number;
}

export default class CardScoreComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        if (this.props.score === null) {
            return <Avatar>-</Avatar>;
        }
        return (
            <Avatar backgroundColor={get_grade_color(this.props.score)}>
                {this.props.score}
            </Avatar>
        );
    }
}

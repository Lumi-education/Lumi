import * as React from 'react';
import * as debug from 'debug';

import { IconButton } from 'material-ui';

import SVGCheckbox from 'material-ui/svg-icons/toggle/check-box';
import SVGCheckboxoutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';

import { get_grade_color, get_grade_string } from '../../ui/utils';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    status: 'todo' | 'completed' | 'improve';
    score: number;
}

export default class CardTypeComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        let status;
        switch (this.props.status) {
            case 'todo':
                status = <SVGCheckboxoutline />;
                break;
            case 'completed':
                status = <SVGCheckbox />;
                break;
            default:
                status = <SVGCheckboxoutline />;
                break;
        }

        return status;
    }
}

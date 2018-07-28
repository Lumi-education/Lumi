import * as React from 'react';
import * as debug from 'debug';

import {Avatar} from 'material-ui';

import SVGMultiplechoice from 'material-ui/svg-icons/action/view-agenda';
import {get_grade_color, get_grade_string} from 'lib/ui/utils';

const log = debug('lumi:packages:cards:components:uploadcard');

interface IProps {
    card_type: string;
    score?: number;
}

export default class CardTypeComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        let card_type;
        switch (this.props.card_type) {
            case 'multiplechoice':
                card_type = <SVGMultiplechoice />;
                break;
            default:
                card_type = 'U';
                break;
        }

        return (
            <Avatar
                backgroundColor={get_grade_color(
                    this.props.score !== null ? this.props.score * 100 : null
                )}
            >
                {card_type}
            </Avatar>
        );
    }
}

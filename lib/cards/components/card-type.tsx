import * as React from 'react';
import * as debug from 'debug';

import { Avatar } from 'material-ui';

import SVGMultiplechoice from 'material-ui/svg-icons/action/view-agenda';
import SVGVideo from 'material-ui/svg-icons/av/play-arrow';
import { get_grade_color } from '../../ui/utils';

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
            case 'video':
                card_type = <SVGVideo />;
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

export function _card_type(__card_type): JSX.Element {
    switch (__card_type) {
        case 'multiplechoice':
            return <SVGMultiplechoice />;
        case 'video':
            return <SVGVideo />;
        default:
            return <div>U</div>;
    }
}

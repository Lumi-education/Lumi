// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import TextCardComponent from '../components/text';

// modules
import * as Cards from '..';
import * as Flow from 'lib/flow';

const log = debug('lumi:packages:cards:container:multiplechoice-card');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.ITextCard;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class TextCardContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.log = this.log.bind(this);
    }

    public log(msg: string) {
        log(msg);
        this.setState({ status: msg });
    }

    public componentWillMount() {
        this.props.dispatch(
            Flow.actions.save_data(this.props.assignment_id, {
                state: 'viewed',
                score: 1,
                maxScore: 1,
                finished: new Date().getTime()
            })
        );
    }

    public render() {
        const { card } = this.props;

        if (card) {
            return (
                <TextCardComponent
                    card_id={this.props.card._id}
                    text={this.props.card.text}
                />
            );
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;

    return {
        user_id,
        card_id: ownProps.card_id,
        assignment_id: ownProps.assignment_id,
        card: Cards.selectors.select_card(
            state,
            ownProps.card_id
        ) as Cards.ITextCard
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(TextCardContainer);

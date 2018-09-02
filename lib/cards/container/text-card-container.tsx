// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';
import raven from 'lib/core/raven';
import { convert_attachment_url } from '../utils';

// components
import TextCardComponent from '../components/text';

// modules
import * as Cards from '../';

const log = debug('lumi:packages:cards:container:multiplechoice-card');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.ITextCard;
    data: Cards.ITextCardData;
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
        this.log('checking for data');
        this.props
            .dispatch(
                Cards.actions.get_card_data(
                    this.props.user_id,
                    this.props.assignment_id,
                    this.props.card_id
                )
            )
            .then(res => {
                if (res.response.status === 404) {
                    this.log('no data found. creating..');
                    raven.captureMessage('data not found');

                    this.props
                        .dispatch(
                            Cards.actions.create_data<Cards.ITextCardData>({
                                _id:
                                    this.props.user_id +
                                    '-' +
                                    this.props.assignment_id +
                                    '-' +
                                    this.props.card_id,
                                type: 'data',
                                user_id: undefined,
                                created_at: undefined,
                                show_answer: false,
                                updated_at: undefined,
                                score: 0,
                                card_type: 'text',
                                data_type: 'card',
                                processed: true,
                                graded: true,
                                is_graded: false,
                                card_id: this.props.card._id,
                                assignment_id: this.props.assignment_id
                            })
                        )
                        .then(create_res => {
                            this.log('data created.');
                            this.setState({ loading: false });
                        });
                } else {
                    this.log('data found.');
                    this.setState({ loading: false });
                }
            });
    }

    public render() {
        const { card, data } = this.props;

        if (card && data) {
            const text = convert_attachment_url(card.text, card._id);

            return <TextCardComponent text={this.props.card.text} />;
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
        ) as Cards.ITextCard,
        data: Cards.selectors.select_data(
            state,
            user_id,
            ownProps.assignment_id,
            ownProps.card_id
        ) as Cards.ITextCardData
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

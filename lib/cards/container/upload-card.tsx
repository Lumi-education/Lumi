// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';
import * as raven from 'raven-js';
// components
import UploadCardComponent from '../components/upload';

// modules
import * as Cards from '../';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IUploadCard;
    data: Cards.IUploadCardData;
    // collection_data;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading?: boolean;
    status?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UploadCardContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false,
            status: 'init'
        };

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
                            Cards.actions.create_data<Cards.IUploadCardData>({
                                _id:
                                    this.props.user_id +
                                    '-' +
                                    this.props.assignment_id +
                                    '-' +
                                    this.props.card_id,
                                type: 'data',
                                user_id: this.props.user_id,
                                created_at: undefined,
                                updated_at: undefined,
                                card_type: 'upload',
                                processed: true,
                                data_type: 'card',
                                is_graded: true,
                                show_answer: false,
                                card_id: this.props.card._id,
                                score: 0,
                                graded: false,
                                assignment_id: this.props.assignment_id,
                                _attachments: undefined
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

    public componentDidMount() {
        this.props.dispatch(
            Cards.actions.update_data(
                assign({}, this.props.data, { processed: true })
            )
        );
    }

    public render() {
        const { card, data } = this.props;

        if (card && data) {
            return (
                <UploadCardComponent
                    text={this.props.card.text}
                    doc_id={this.props.data._id}
                    _rev={(this.props.data as any)._rev}
                    attachments={this.props.data._attachments}
                    insert_cb={(link: string) => {
                        log(link);
                    }}
                />
            );
        }

        return <div>{this.state.status}</div>;
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
        ) as Cards.IUploadCard,
        data: Cards.selectors.select_data(
            state,
            user_id,
            ownProps.assignment_id,
            ownProps.card_id
        ) as Cards.IUploadCardData
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
)(UploadCardContainer);

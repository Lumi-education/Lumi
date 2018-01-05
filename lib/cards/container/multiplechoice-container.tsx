// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';

import { convert_attachment_url } from '../utils';

// components
import MultiplechoiceComponent from 'lib/cards/components/multiplechoice-component';

// types
import { IState } from 'client/state';
import {
    IMultiplechoiceCard,
    IMultiplechoiceCardData,
    ICollectionData
} from '../types';

// selectors
import { select_card } from 'lib/cards/selectors';
import { select_data, select_collection } from 'lib/data/selectors';

// actions
import {
    create_data,
    update_data,
    get_data
} from 'lib/data/actions';
import { get_card, update_card } from 'lib/cards/actions';

const log = debug('lumi:packages:cards:container:multiplechoice-card');

interface IPassedProps {
    card_id: string;
    collection_id: string;
}

interface IStateProps extends IPassedProps {
    card: IMultiplechoiceCard;
    data: IMultiplechoiceCardData;
    collection_data: ICollectionData;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class MultiplechoiceCardViewContainer extends React.Component<
    IProps,
    {}
> {
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
                get_data({
                    collection_id: this.props.collection_id,
                    card_id: this.props.card._id
                })
            )
            .then(res => {
                if (res.payload.length === 0) {
                    this.log('no data found. creating..');
                    this.props
                        .dispatch(
                            create_data<IMultiplechoiceCardData>({
                                _id: undefined,
                                type: 'data',
                                user_id: undefined,
                                created_at: undefined,
                                updated_at: undefined,
                                score: 0,
                                card_type: 'multiplechoice',
                                items: [],
                                data_type: 'card',
                                card_id: this.props.card._id,
                                collection_id: this.props.collection_id
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

            const card_items = card.items.map(item =>
                convert_attachment_url(item, card._id)
            );

            return (
                <MultiplechoiceComponent
                    text={text}
                    items={card_items}
                    selected_items={data.items || []}
                    show_correct_values={this.props.collection_data.submitted}
                    cb={(items, score) => {
                        this.props.collection_data.submitted
                            ? noop()
                            : this.props.dispatch(
                                  update_data(
                                      assign({}, this.props.data, {
                                          items,
                                          score
                                      })
                                  )
                              );
                    }}
                />
            );
        }

        return <div>loading</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card_id: ownProps.card_id,
        collection_id: ownProps.collection_id,
        card: select_card(state, ownProps.card_id) as IMultiplechoiceCard,
        collection_data: select_collection(state, ownProps.collection_id),
        data: select_data(
            state,
            ownProps.collection_id,
            ownProps.card_id
        ) as IMultiplechoiceCardData
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
)(MultiplechoiceCardViewContainer);

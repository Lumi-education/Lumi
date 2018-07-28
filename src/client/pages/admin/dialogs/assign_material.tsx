// modules
import * as React from 'react';
import {connect} from 'react-redux';
import {push} from 'lib/ui/actions';
import * as debug from 'debug';

// components
import {
    Dialog,
    DatePicker,
    TimePicker,
    RaisedButton,
    FloatingActionButton
} from 'material-ui';
import ChipInput from 'material-ui-chip-input';
import ContentAdd from 'material-ui/svg-icons/content/add';
import CardList from 'lib/cards/container/card-list';

// local
import {IState} from 'client/state';

// types
import * as Collections from 'lib/collections';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';
import * as Tags from 'lib/tags';
import * as Flow from 'lib/flow';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {
    group_id: string;
    user_ids?: string[];
}

interface IStateProps extends IPassedProps {
    open: boolean;
    card_ids: string[];
    user_ids: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AssignMaterialDialog extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (!this.props.open && nextProps.open) {
            this.props.dispatch(Cards.actions.reset_card_selection());
        }
    }

    public render() {
        return (
            <div>
                <FloatingActionButton
                    onClick={() =>
                        this.props.dispatch(
                            Collections.actions.show_assign_collection_dialog()
                        )
                    }
                    style={{
                        margin: '20px'
                    }}
                >
                    <ContentAdd />
                </FloatingActionButton>
                <Dialog
                    title="Material"
                    autoScrollBodyContent={true}
                    contentStyle={{
                        width: '100%',
                        maxWidth: 'none'
                    }}
                    actions={[
                        <RaisedButton
                            label="Cancel"
                            onClick={() =>
                                this.props.dispatch(
                                    Collections.actions.hide_assign_collection_dialog()
                                )
                            }
                        />,
                        <RaisedButton
                            primary={true}
                            label="OK"
                            onClick={() => {
                                this.props
                                    .dispatch(
                                        Flow.actions.assign(
                                            this.props.group_id,
                                            this.props.user_ids,
                                            this.props.card_ids
                                        )
                                    )
                                    .then(res => {
                                        this.props.dispatch(
                                            Collections.actions.hide_assign_collection_dialog()
                                        );
                                    });
                            }}
                        />
                    ]}
                    open={this.props.open}
                    onRequestClose={() =>
                        this.props.dispatch(
                            Collections.actions.hide_assign_collection_dialog()
                        )
                    }
                >
                    <Users.container.ChipInput />
                    <div
                        style={{
                            display: 'flex'
                        }}
                    >
                        <div
                            style={{
                                flex: 1
                            }}
                        >
                            <Tags.TagsFilterContainer />

                            <CardList
                                card_ids={['all']}
                                onClick={card_id =>
                                    this.props.dispatch(
                                        Cards.actions.select_card(card_id)
                                    )
                                }
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.collections.ui.show_assign_collection_dialog,
        user_ids: state.users.ui.selected_users,
        card_ids: state.cards.ui.selected_cards,
        group_id: ownProps.group_id
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
)(AssignMaterialDialog);

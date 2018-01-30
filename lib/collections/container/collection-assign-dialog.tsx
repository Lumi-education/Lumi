// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'lib/ui/actions';
import ChipInput from 'material-ui-chip-input';
import * as debug from 'debug';
import {
    Dialog,
    DatePicker,
    TimePicker,
    RaisedButton,
    FloatingActionButton
} from 'material-ui';

// local
import { IState } from 'client/state';

// types
import * as Collections from '../';
import * as Cards from 'lib/cards';
import * as Users from 'lib/users';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    user_ids: string[];
    collection_ids: string[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    due_date?: Date;
}

export class CollectionAssignDialogContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            due_date: undefined
        };
    }

    public render() {
        log(this.state.due_date);
        return (
            <div>
                <FloatingActionButton
                    onClick={() =>
                        this.props.dispatch(
                            Collections.actions.show_assign_collection_dialog()
                        )
                    }
                    style={{
                        margin: '20px',
                        display:
                            this.props.user_ids.length === 0 ? 'none' : 'block'
                    }}
                >
                    AC
                </FloatingActionButton>
                <Dialog
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
                                this.props.collection_ids.forEach(
                                    collection_id =>
                                        this.props.dispatch(
                                            Collections.actions.assign_collection(
                                                this.props.user_ids,
                                                collection_id,
                                                this.state
                                            )
                                        )
                                );
                                this.props.dispatch(
                                    Collections.actions.hide_assign_collection_dialog()
                                );
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
                    <Collections.container.ChipInput />
                    <div style={{ display: 'flex' }}>
                        <DatePicker
                            style={{ flex: 1 }}
                            floatingLabelText={'Abgabe Datum'}
                            hintText="Abgabe Datum"
                            container="inline"
                            value={this.state.due_date}
                            onChange={(e, v) => this.setState({ due_date: v })}
                        />
                        <TimePicker
                            style={{ flex: 1 }}
                            floatingLabelText="Abgabge Uhrzeit"
                            format="24hr"
                            value={this.state.due_date}
                            onChange={(e, v) => this.setState({ due_date: v })}
                            hintText="Abgabe Uhrzeit"
                        />
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
        collection_ids: state.collections.ui.selected_collections
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
)(CollectionAssignDialogContainer);

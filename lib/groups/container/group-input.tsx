// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { AutoComplete } from 'material-ui';
import ChipInput from 'material-ui-chip-input';

import * as Groups from '../';

interface IPassedProps {
    hintText?: string;
    onAddGroup?: (group_id: string) => void;
}

interface IStateProps extends IPassedProps {
    groups: Map<string, Groups.IGroup>;
    selected_groups: Groups.IGroup[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class GroupInputContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Groups.actions.get_groups());
    }

    public render() {
        return (
            <ChipInput
                hintText={this.props.hintText}
                floatingLabelText={this.props.hintText}
                fullWidth={true}
                value={this.props.selected_groups}
                allowDuplicates={false}
                dataSource={this.props.groups.toArray()}
                dataSourceConfig={{
                    text: 'name',
                    value: '_id'
                }}
                openOnFocus={true}
                filter={AutoComplete.fuzzyFilter}
                onRequestAdd={group => {
                    if (group._id) {
                        this.props.dispatch(
                            Groups.actions.select_group(group._id)
                        );
                        if (this.props.onAddGroup) {
                            this.props.onAddGroup(group._id);
                        }
                    }
                }}
                onRequestDelete={group_id => {
                    this.props.dispatch(Groups.actions.select_group(group_id));
                }}
            />
        );
    }
}

function mapStateToProps(state: Groups.IState, ownProps): IStateProps {
    return {
        selected_groups: Groups.selectors.selected_groups(state),
        groups: state.groups.map,
        hintText: ownProps.hintText || 'Groups',
        onAddGroup: ownProps.onAddGroup
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
)(GroupInputContainer);

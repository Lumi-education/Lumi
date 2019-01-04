// modules
import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import * as Core from 'lib/core';
import * as Groups from 'lib/groups';

interface IPassedProps {
    group_ids: string[];
    onChange: (new_group_ids: string[]) => void;
}

interface IStateProps extends IPassedProps {
    classes: any;

    group: (group_id: string) => Groups.models.Group;
    groups: Groups.models.Group[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class GroupsChipInputContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const { classes } = this.props;

        return (
            <Select
                value={this.props.group_ids.map(group_id => {
                    const group = this.props.group(group_id);
                    return { value: group._id, label: group.name };
                })}
                isMulti={true}
                name={Core.i18n.t('groups')}
                onChange={e => this.props.onChange(e.map(v => v.value))}
                options={this.props.groups.map(group => {
                    return { value: group._id, label: group.name };
                })}
                className="basic-multi-select"
                classNamePrefix="select"
            />
        );
    }
}

function mapStateToProps(state: Groups.types.IState, ownProps): IStateProps {
    return {
        group: (group_id: string) => Groups.selectors.group(state, group_id),
        group_ids: ownProps.group_ids,
        classes: ownProps.classes,
        onChange: ownProps.onChange,
        groups: state.groups.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(GroupsChipInputContainer)
);

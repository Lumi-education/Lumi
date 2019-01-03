import * as React from 'react';
import { connect } from 'react-redux';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

// components
import Avatar from 'client/components/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

// icons
import GroupIcon from '@material-ui/icons/Group';

// modules
import * as Groups from '../';
import * as UI from 'lib/ui';
import * as Core from 'lib/core';

interface IPassedProps {
    group: Groups.models.Group;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IStateProps {
    selected_group_ids: string[];
    classes: any;
}

interface IProps extends IPassedProps, IDispatchProps, IStateProps {}

interface IComponentState {}

export class GroupListItemComponent extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const { group } = this.props;
        return (
            <ListItem
                onClick={() =>
                    this.props.dispatch(
                        UI.actions.push('/admin/groups/' + group._id)
                    )
                }
            >
                <Avatar doc={group}>
                    <GroupIcon />
                </Avatar>
                <ListItemText
                    primary={group.name}
                    secondary={
                        group.autojoin ? (
                            <Typography color="error">
                                {Core.i18n.t('autojoin')}
                            </Typography>
                        ) : null
                    }
                />
                <ListItemSecondaryAction>
                    <Checkbox
                        onChange={() =>
                            this.props.dispatch(
                                Groups.actions.select_group(group._id)
                            )
                        }
                        checked={
                            this.props.selected_group_ids.indexOf(group._id) >
                            -1
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

function mapStateToProps(state: Groups.types.IState, ownProps): IStateProps {
    return {
        selected_group_ids: state.groups.ui.selected_groups,
        classes: ownProps.classes
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
    )(GroupListItemComponent)
);

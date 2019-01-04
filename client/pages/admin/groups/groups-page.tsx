// modules
import * as React from 'react';
import { connect } from 'react-redux';

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

// types
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Groups from 'lib/groups';

interface IStateProps {
    groups: Groups.models.Group[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AdminGroups extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const { groups } = this.props;
        return (
            <div id="groups-page">
                <Core.components.AppBar title={Core.i18n.t('groups')} />
                <Core.components.Content>
                    <Groups.components.List groups={groups} />
                </Core.components.Content>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        groups: Groups.selectors.groups_list(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({});

export default withStyles(styles)(
    connect<{}, {}, {}>(
        mapStateToProps,
        mapDispatchToProps
    )(AdminGroups)
);

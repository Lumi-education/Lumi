// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Dialog, RaisedButton } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Cards from 'lib/cards';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    selected_users: string[];
    selected_groups: string[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class GroupsAssignDialog extends React.Component<
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
            <Dialog
                title={Core.i18n.t('groups')}
                autoScrollBodyContent={true}
                contentStyle={{
                    width: '100%',
                    maxWidth: 'none'
                }}
                actions={[<RaisedButton label={Core.i18n.t('cancel')} />]}
                open={this.props.open}
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: false,
        selected_users: state.users.ui.selected_users,
        selected_groups: state.groups.ui.selected_groups
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
)(GroupsAssignDialog);

import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import * as debug from 'debug';

import TourComponent from 'reactour';

// state
import { IState } from 'client/state';

// modules
import * as UI from 'lib/ui';
import * as Core from 'lib/core';
import * as DB from 'lib/db';
import * as Groups from 'lib/groups';
import * as Tour from 'lib/tour';

import CreateCardDialog from 'client/dialogs/card-create-dialog';
import AssignmentDialog from 'client/dialogs/assignment-view-dialog';

const log = debug('lumi:client:pages:admin:index');

interface IStateProps {
    step: number;
    show: boolean;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AdminTour extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};

        this.next = this.next.bind(this);
    }

    public next() {
        this.props.dispatch(Tour.actions.next(this.props.step));
    }

    public render() {
        return (
            <TourComponent
                goToStep={this.props.step}
                steps={[
                    {
                        content: 'This is my first Step',
                        position: 'bottom'
                    },
                    {
                        selector: '.left-drawer_groups',
                        content: 'This is my first Step',
                        position: 'bottom'
                    },
                    {
                        selector: '.core_list-toolbar_add-button',
                        content: 'This is my first Step',
                        position: 'bottom'
                    },
                    {
                        selector: '.groups_group-create-dialog',
                        content: 'This is my first Step',
                        position: 'bottom'
                    },
                    {
                        selector: '.users_empty-list',
                        content: 'This is my first Step',
                        position: 'bottom'
                    }
                ]}
                isOpen={this.props.show}
                onRequestClose={() => {
                    this.props.dispatch(Tour.actions.hide());
                }}
                nextStep={this.next}
                updateDelay={250}
            />
        );
    }
}
function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        step: state.tour.admin.step,
        show: state.tour.admin.show
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    contentContainer: {
        maxWidth: '680px',
        margin: 'auto'
    }
});

export default withRouter(
    withStyles(styles)(
        connect<{}, {}, {}>(
            mapStateToProps,
            mapDispatchToProps
        )(AdminTour)
    )
);

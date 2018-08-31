// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Dialog, RaisedButton } from 'material-ui';

// local
import { IState } from '../types';

// modules
import * as UI from '..';

const log = debug('lumi:lib:ui:container:alarm-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    message: string;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AlarmDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Dialog
                title="Alarm"
                actions={[
                    <RaisedButton
                        label="OK"
                        onClick={() =>
                            this.props.dispatch(UI.actions.hide_alarm_dialog())
                        }
                    />
                ]}
                open={this.props.open}
            >
                {this.props.message}
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: state.ui.show_alarm_dialog,
        message: state.ui.alarm_dialog_message
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
)(AlarmDialog);

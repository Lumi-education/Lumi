// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { assign, noop } from 'lodash';
import raven from 'lib/core/raven';
// components
import UploadCardComponent from '../components/upload';

import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Cards from '../';
import * as Flow from 'lib/flow';
import { RaisedButton } from 'material-ui';
import * as UI from 'lib/ui';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IUploadCard;
    assignment: Flow.models.Assignment;
    UI: UI.IUI;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading?: boolean;
    status?: string;
    color?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UploadCardContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false,
            status: 'init',
            color: this.props.UI.colors.primary
        };

        this.log = this.log.bind(this);
    }

    public log(msg: string) {
        log(msg);
        this.setState({ status: msg });
    }

    public render() {
        const { card } = this.props;
        if (card) {
            return (
                <div>
                    <UploadCardComponent
                        card_id={this.props.card._id}
                        text={this.props.card.text}
                    >
                        {this.props.assignment.state !== null ? (
                            <img
                                src={'/files/' + this.props.assignment.state[0]}
                            />
                        ) : null}
                        {this.state.color === this.props.UI.colors.error ? (
                            <div
                                style={{
                                    background: this.props.UI.colors.error
                                }}
                            >
                                Upload fehlgeschlagen
                            </div>
                        ) : null}
                        {/* <Core.components.FileList
                        files={this.props.assignment.state || []}
                        onClick={file => log(file)}
                    /> */}
                        <Core.components.FileUpload
                            post_url="/api/v0/core/upload"
                            path={this.props.assignment._id}
                            onSuccess={file => {
                                log(file);

                                this.setState({
                                    color: this.props.UI.colors.success
                                });
                                this.props.dispatch(
                                    Flow.actions.save_state(
                                        this.props.assignment._id,
                                        [file.path]
                                    )
                                );
                            }}
                            onError={error => {
                                this.setState({
                                    color: this.props.UI.colors.error
                                });
                            }}
                        >
                            <RaisedButton
                                buttonStyle={{
                                    backgroundColor: this.state.color
                                }}
                                fullWidth={true}
                                label="Hochladen"
                            />
                        </Core.components.FileUpload>
                    </UploadCardComponent>
                </div>
            );
        }

        return <div>{this.state.status}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;

    return {
        user_id,
        card_id: ownProps.card_id,
        UI: state.ui,
        assignment_id: ownProps.assignment_id,
        card: Cards.selectors.select_card(
            state,
            ownProps.card_id
        ) as Cards.IUploadCard,
        assignment: Flow.selectors.assignment_by_id(
            state,
            ownProps.assignment_id
        )
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
)(UploadCardContainer);

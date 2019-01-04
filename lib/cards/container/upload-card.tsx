// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import UploadCardComponent from '../components/upload';
import { RaisedButton } from 'material-ui';

// types
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as Cards from '../';
import * as Flow from 'lib/flow';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IUploadCard;
    assignment: Flow.models.Assignment;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    loading?: boolean;
    status?: string;
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
            status: 'init'
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

                        <Core.components.FileUpload
                            post_url="/api/v0/core/upload"
                            path={this.props.assignment._id}
                            onSuccess={file => {
                                log(file);

                                this.props.dispatch(
                                    Flow.actions.save_state(
                                        this.props.assignment._id,
                                        [file.path]
                                    )
                                );
                            }}
                        >
                            <RaisedButton
                                fullWidth={true}
                                label={Core.i18n.t('upload')}
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

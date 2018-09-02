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
    assignment: Flow.IAssignment;
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
                <UploadCardComponent
                    text={this.props.card.text}
                    doc_id={this.props.assignment._id}
                    _rev={(this.props.assignment as any)._rev}
                    attachments={this.props.assignment._attachments}
                    insert_cb={(link: string) => {
                        log(link);
                    }}
                />
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

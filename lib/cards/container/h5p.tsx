// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

import { IState } from 'client/state';

// components
import H5PComponent from '../components/h5p';

// modules
import * as Cards from '..';
import * as Flow from 'lib/flow';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IH5PCard;
    assignment: Flow.IAssignment;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IComponentState {
    iFrameHeight?: string;
}

interface IProps extends IStateProps, IDispatchProps {}

export class H5PCardContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            iFrameHeight: '0 px'
        };
    }

    public componentWillMount() {
        console.log(this.props.assignment.state);
        (window as any).__H5P_USERDATA = this.props.assignment.state
            ? {
                  0: { state: this.props.assignment.state.data }
              }
            : undefined;
    }

    public render() {
        return (
            <H5PComponent
                content_id={this.props.card._id}
                integration={{
                    ajax: {
                        setFinished:
                            '/api/v0/flow/assignment/' +
                            this.props.assignment_id +
                            '/data',
                        contentUserData:
                            '/api/v0/flow/assignment/' +
                            this.props.assignment_id +
                            '/state?data_type=:dataType&subContentId=:subContentId'
                    },
                    saveFreq: 10,
                    user: {
                        name: this.props.user_id,
                        mail: this.props.user_id + '@Lumi.education'
                    },
                    contents: {}
                }}
                h5p_found={true}
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;

    return {
        user_id,
        assignment_id: ownProps.assignment_id,
        assignment: Flow.selectors.assignment_by_id(
            state,
            ownProps.assignment_id
        ),
        card_id: ownProps.card_id,
        card: Cards.selectors.select_card(
            state,
            ownProps.card_id
        ) as Cards.IH5PCard
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
)(H5PCardContainer);

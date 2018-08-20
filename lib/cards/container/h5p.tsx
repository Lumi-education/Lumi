// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import * as ReactDOM from 'react-dom';
// components

import * as Cards from '..';
import H5PComponent from '../components/h5p';

const log = debug('lumi:packages:cards:container:freetextcard');

interface IPassedProps {
    card_id: string;
    assignment_id: string;
    user_id?: string;
}

interface IStateProps extends IPassedProps {
    card: Cards.IH5PCard;
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

    public render() {
        return (
            <H5PComponent
                content_id={this.props.card.content_id}
                integration={{
                    ajax: {
                        // Where to post user results
                        setFinished:
                            '/api/v0/flow/assignment/' +
                            this.props.assignment_id +
                            '/data',
                        // Words beginning with : are placeholders
                        contentUserData:
                            '/api/v0/flow/assignment/' +
                            this.props.assignment_id +
                            '/state?data_type=:dataType&subContentId=:subContentId'
                    },
                    saveFreq: 10, // How often current content state should be saved. false to disable.
                    user: {
                        // Only if logged in !
                        name: this.props.user_id,
                        mail: this.props.user_id + '@Lumi.education'
                    }
                }}
            />
        );
    }
}

function mapStateToProps(state: Cards.IState, ownProps): IStateProps {
    const user_id = ownProps.user_id || (state as any).auth.user_id;

    return {
        user_id,
        assignment_id: ownProps.assignment_id,
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

import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';
import { difference } from 'lodash';
// types
import { IState } from 'client/state';

// modules
import * as Flow from 'lib/flow';
import * as Material from 'lib/material';

const log_info = debug('lumi:pages:user:MaterialFetchContainer');

interface IPassedProps {}
interface IStateProps extends IPassedProps {
    material_ids: string[];
    flow: string[];
    // assignment: (assignment_id: string) => Flow.models.Assignment;
    // flow: string[];
    // card: (card_id: string) => Cards.ICard;
    // unread_comments: (assignment_id: string) => Comments.models.Comment[];
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserMaterialFetchContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        log_info('componentWillMount', this.props.material_ids);
        this.props.dispatch(Material.actions.get(this.props.material_ids));
    }

    public componentDidUpdate(prevProps: IProps) {
        log_info('componentDidUpdate');
        const diff = difference(
            this.props.material_ids,
            prevProps.material_ids
        );
        log_info(
            'diff',
            prevProps.material_ids.length,
            this.props.material_ids.length
        );
        if (diff.length !== 0) {
            log_info('test', diff);
            this.props.dispatch(Material.actions.get(diff));
        }
    }

    public render() {
        return null;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        material_ids: Flow.selectors
            .assignment_by_ids(state, state.users.me.flow)
            .map(a => a.material_id),
        flow: state.users.me.flow
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(
    mapStateToProps,
    mapDispatchToProps
)(UserMaterialFetchContainer);

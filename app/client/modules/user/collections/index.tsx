// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';

import { Map } from 'immutable';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Chip from 'material-ui/Chip';

import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import SVGLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AppBar from 'material-ui/AppBar';
import FilterBar from 'client/packages/ui/components/filter-bar';

// local
import { IState } from 'client/state';

// types
import { ICollection, ICard } from 'common/types';

// selectors
import { select_cards_by_ids } from 'client/packages/cards/selectors';
import { select_collection_by_id } from 'client/packages/collections/selectors';
// actions
import { get_collection } from 'client/packages/collections/actions';
import { get_user_collection_data } from 'client/packages/data/actions';

interface IStateProps {
    collection_id: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserCollections extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_collection(this.props.collection_id));
        this.props.dispatch(get_user_collection_data(this.props.collection_id));
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (this.props.collection_id !== nextProps.collection_id) {
            this.props.dispatch(get_collection(nextProps.collection_id));
            this.props.dispatch(
                get_user_collection_data(nextProps.collection_id)
            );
        }
    }

    public render() {
        return <div>{this.props.children}</div>;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        collection_id: ownProps.params.collection_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    UserCollections
);

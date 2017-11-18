// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Map } from 'immutable';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Chip from 'material-ui/Chip';

import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';

import FilterBar from 'client/components/filter-bar';

// local
import { IState } from 'client/state';

// types
import { ICollection } from 'common/types';

// actions
import { get_collections } from 'client/packages/collections/actions';

interface IStateProps {
    collections: ICollection[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text?: string;
}

export class AdminCollections extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(get_collections());
    }

    public render() {
        return (
            <div>
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })}
                />
                <List>
                    {this.props.collections
                        .filter(collection => {
                            return this.state.search_text === ''
                                ? true
                                : collection.name
                                      .toLocaleLowerCase()
                                      .indexOf(
                                          this.state.search_text.toLocaleLowerCase()
                                      ) > -1;
                        })
                        .map(collection => (
                            <div>
                                <ListItem
                                    leftAvatar={
                                        <Avatar>
                                            {collection.name.substring(0, 3)}
                                        </Avatar>
                                    }
                                    primaryText={collection.name}
                                    onClick={() =>
                                        this.props.dispatch(
                                            push(
                                                '/admin/collections/' +
                                                    collection._id
                                            )
                                        )}
                                />
                                <Divider inset={true} />
                            </div>
                        ))}
                </List>
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        collections: state.collections.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    AdminCollections
);

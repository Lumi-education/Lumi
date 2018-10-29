// modules
import * as React from 'react';
import { connect } from 'react-redux';

import {
    Avatar,
    Paper,
    List,
    ListItem,
    Divider,
    FloatingActionButton
} from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import FilterBar from 'lib/ui/components/filter-bar';

// state
import { IState } from 'client/state';

// modules
import * as Tags from 'lib/tags';
import * as UI from 'lib/ui';
import { push } from 'lib/ui/actions';

import TagsDialog from 'client/dialogs/tags-view-dialog';

interface IStateProps {
    tags: Tags.ITag[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
    search_text?: string;
}

export class AdminTagsPage extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search_text: ''
        };
    }

    public componentWillMount() {
        this.props.dispatch(Tags.actions.get_tags());
    }

    public render() {
        return (
            <div>
                <FilterBar
                    filter={this.state.search_text}
                    set_filter={filter =>
                        this.setState({ search_text: filter })
                    }
                />
                <Paper>
                    <List>
                        {this.props.tags.map(tag => (
                            <div key={tag._id}>
                                <ListItem
                                    onClick={() =>
                                        this.props.dispatch(
                                            push('/admin/tags/' + tag._id)
                                        )
                                    }
                                    primaryText={tag.name}
                                    secondaryText={tag.description}
                                    leftAvatar={
                                        <Avatar backgroundColor={tag.color}>
                                            {tag.short_name ||
                                                tag.name.substr(0, 3)}
                                        </Avatar>
                                    }
                                />
                                <Divider inset={true} />
                            </div>
                        ))}
                    </List>
                </Paper>
                <UI.components.ActionBar>
                    <FloatingActionButton
                        onClick={() => {
                            this.props.dispatch(
                                Tags.actions.toggle_tags_dialog()
                            );
                        }}
                        style={{
                            margin: '20px',
                            zIndex: 5000
                        }}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </UI.components.ActionBar>
                <TagsDialog />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
    return {
        tags: Tags.selectors.select_all_tags(state)
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
)(AdminTagsPage);

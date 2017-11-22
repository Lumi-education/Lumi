// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';

// components
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import { grey400 } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

// types
import { IState } from 'client/state';
import { ITag } from 'common/types';

// selectors
import { select_tag } from 'client/packages/tags/selectors';

// actions
import {
    create_tag_and_add_to_card,
    get_tags,
    delete_tag
} from 'client/packages/tags/actions';

interface IPassedProps {
    tag_id: string;
}

interface IStateProps extends IPassedProps {
    tag: ITag;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class TagListItemContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const tag = this.props.tag;
        return (
            <div>
                <ListItem
                    leftAvatar={
                        <Avatar
                            style={{
                                background:
                                    tag.color ||
                                    'linear-gradient(120deg, #8e44ad, #3498db)'
                            }}
                        >
                            {tag.short_name || tag.name.substring(0, 3)}
                        </Avatar>
                    }
                    primaryText={tag.name}
                    secondaryText={
                        tag.description || 'this tag has no description'
                    }
                    rightIconButton={rightIconMenu([
                        <MenuItem
                            onClick={() =>
                                this.props.dispatch(delete_tag(tag._id))
                            }
                        >
                            Delete
                        </MenuItem>
                    ])}
                />
                <Divider inset={true} />
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        tag: select_tag(state, ownProps.tag_id),
        tag_id: ownProps.tag_id
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
)(TagListItemContainer);

const iconButtonElement = (
    <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
        <MoreVertIcon color={grey400} />
    </IconButton>
);

function rightIconMenu(menuItems) {
    return (
        <IconMenu iconButtonElement={iconButtonElement}>{menuItems}</IconMenu>
    );
}

// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'client/packages/ui/actions';
import { Map } from 'immutable';

// components
import { TagInputComponent } from '../';

// types
import { IState } from 'client/state';
import { ITag } from '../types';

// selectors
import {
    select_tag_ids_for_doc,
    select_tags_as_map
} from 'client/packages/tags/selectors';

// actions
import {
    create_tag_and_add_to_doc,
    get_tags,
    delete_tag,
    add_tag_to_doc,
    rem_tag_from_doc
} from 'client/packages/tags/actions';

interface IPassedProps {
    tag_ids: string[];
    add: (tag: ITag) => void;
    delete: (tag_id: string) => void;
}

interface IStateProps extends IPassedProps {
    tags: Map<string, ITag>;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class TagFilterContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        this.props.dispatch(get_tags());
    }

    public render() {
        const tags = this.props.tags;
        return (
            <TagInputComponent
                tags={this.props.tags}
                tag_ids={this.props.tag_ids || []}
                add={this.props.add}
                delete={this.props.delete}
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        tags: select_tags_as_map(state),
        tag_ids: ownProps.tag_ids,
        add: ownProps.add,
        delete: ownProps.delete
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
)(TagFilterContainer);

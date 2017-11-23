// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';

// components
import { TagInputComponent } from '../';

// types
import { IState } from 'client/state';
import { ITag } from 'common/types';

// selectors
import { select_tags_as_map } from 'client/packages/tags/selectors';

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
    doc_id: string;
}

interface IStateProps extends IPassedProps {
    tags: Map<string, ITag>;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class TagInputContainer extends React.Component<IProps, {}> {
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
                add={tag => {
                    this.props.tags.get(tag._id)
                        ? this.props.dispatch(
                              add_tag_to_doc(this.props.doc_id, tag._id)
                          )
                        : this.props.dispatch(
                              create_tag_and_add_to_doc(
                                  this.props.doc_id,
                                  tag.name
                              )
                          );
                }}
                delete={(tag_id: string) =>
                    this.props.dispatch(
                        rem_tag_from_doc(this.props.doc_id, tag_id)
                    )
                }
            />
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        tags: select_tags_as_map(state),
        tag_ids: ownProps.tag_ids,
        doc_id: ownProps.doc_id
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
)(TagInputContainer);

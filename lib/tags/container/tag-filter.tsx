// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

// modules
import * as Tags from '../';

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    tags: Map<string, Tags.ITag>;
    tag_ids: string[];
    add: (tag: Tags.ITag) => void;
    delete: (tag_id: string) => void;
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
        this.props.dispatch(Tags.actions.get_tags());
    }

    public render() {
        return (
            <Tags.TagInputComponent
                tags={this.props.tags}
                tag_ids={this.props.tag_ids || []}
                add={tag =>
                    this.props.dispatch(Tags.actions.select_tag(tag._id))
                }
                delete={tag_id =>
                    this.props.dispatch(Tags.actions.select_tag(tag_id))
                }
            />
        );
    }
}

function mapStateToProps(state: Tags.IState, ownProps): IStateProps {
    return {
        tags: Tags.selectors.select_tags_as_map(state),
        tag_ids: state.tags.ui.selected_tags,
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

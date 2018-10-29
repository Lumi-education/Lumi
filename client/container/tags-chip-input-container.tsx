// modules
import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import * as Tags from 'lib/tags';

interface IPassedProps {
    tag_ids: string[];
    onChange: (new_tag_ids: string[]) => void;
}

interface IStateProps extends IPassedProps {
    classes: any;

    tag: (tag_id: string) => Tags.ITag;
    tags: Tags.ITag[];
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class TagsChipInputContainer extends React.Component<
    IProps,
    IComponentState
> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        this.props.dispatch(Tags.actions.get_tags());
    }

    public render() {
        const { classes } = this.props;

        return (
            <Select
                value={this.props.tag_ids.map(tag_id => {
                    const tag = this.props.tag(tag_id);
                    return { value: tag._id, label: tag.name };
                })}
                isMulti={true}
                name="Tags"
                onChange={e => this.props.onChange(e.map(v => v.value))}
                options={this.props.tags.map(tag => {
                    return { value: tag._id, label: tag.name };
                })}
                className={classes.chipInput}
                classNamePrefix="select"
            />
        );
    }
}

function mapStateToProps(state: Tags.IState, ownProps): IStateProps {
    return {
        tag: (tag_id: string) => Tags.selectors.tag(state, tag_id),
        tag_ids: ownProps.tag_ids,
        classes: ownProps.classes,
        onChange: ownProps.onChange,
        tags: state.tags.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

const styles: StyleRulesCallback = theme => ({
    chipInput: {
        zIndex: 999
    }
});

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, IPassedProps>(
        mapStateToProps,
        mapDispatchToProps
    )(TagsChipInputContainer)
);

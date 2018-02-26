// modules
import * as React from 'react';
import { connect } from 'react-redux';
// import { push } from 'lib/ui/actions';
import { Map } from 'immutable';

// components

import * as Tags from '../';
import * as Core from 'lib/core';

interface IPassedProps {
    tag_id: string;
}

interface IStateProps extends IPassedProps {
    tag: Tags.ITag;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IComponentState {}

interface IProps extends IStateProps, IDispatchProps {}

export class TagContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {
        if (!this.props.tag._id) {
            this.props.dispatch(Core.actions.doc(this.props.tag_id));
        }
    }

    public render() {
        const tag = this.props.tag;

        if (!tag._id) {
            return <div>loading</div>;
        }
        return (
            <span
                key={tag._id}
                style={{
                    background: tag.color,
                    display: 'inline',
                    padding: '.2em .6em .3em',
                    fontSize: '75%',
                    fontWeight: 'bold',
                    lineHeight: 1,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'baseline',
                    borderRadius: '.25em'
                }}
            >
                {tag.name}
            </span>
        );
    }
}

function mapStateToProps(state: Tags.IState, ownProps): IStateProps {
    const tag_id = ownProps.tag_id;

    return {
        tag_id,
        tag: Tags.selectors.select_tag(state, tag_id)
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
)(TagContainer);

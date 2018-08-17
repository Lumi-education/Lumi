// modules
import * as React from 'react';
import { connect } from 'react-redux';

// types
import { IState, ITag } from '../types';

// selectors
import * as Tags from '../';

interface IPassedProps {
    tag_ids: string[];
}

interface IStateProps extends IPassedProps {
    tags: ITag[];
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IComponentState {
    requested: boolean;
}

interface IProps extends IStateProps, IDispatchProps {}

export class TagsContainer extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            requested: false
        };
    }

    public render() {
        return (
            <div
                style={{
                    overflow: 'hidden',
                    margin: '4px 0px 0px',
                    color:
                        this.props.tags.length !== 0
                            ? 'rgba(0, 0, 0, 0.541176)'
                            : 'red',
                    lineHeight: '16px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    height: '16px'
                }}
            >
                {this.props.tags.length === 0 ? (
                    <span
                        style={{
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
                        No Tags
                    </span>
                ) : null}
                {this.props.tags.map(tag => (
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
                ))}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        tags: Tags.selectors.tags(state, ownProps.tag_ids),
        tag_ids: ownProps.tag_ids
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
)(TagsContainer);

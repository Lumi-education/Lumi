// modules
import * as React from 'react';
import { connect } from 'react-redux';
import { assign } from 'lodash';
import { push } from 'lib/ui/actions';
import * as moment from 'moment-timezone';

// components
import { Checkbox, IconMenu, IconButton, MenuItem } from 'material-ui';
import SVGTurnedIn from 'material-ui/svg-icons/action/assignment-turned-in';
import SVGCheck from 'material-ui/svg-icons/navigation/check';
import SVGClose from 'material-ui/svg-icons/navigation/close';
import SVGReturn from 'material-ui/svg-icons/action/assignment-return';

// modules
import * as Collections from 'lib/collections';
import * as Core from 'lib/core';

interface IPassedProps {
    data_id: string;
}

interface IStateProps extends IPassedProps {
    collection_data: Collections.ICollectionData;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CollectionSubmittedContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        if (!this.props.collection_data) {
            return <div>loading</div>;
        }
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton>
                        {(() => {
                            if (this.props.collection_data.completed) {
                                return <SVGCheck />;
                            }
                            if (this.props.collection_data.submitted) {
                                return <SVGTurnedIn />;
                            }
                            return <SVGClose />;
                        })()}
                    </IconButton>
                }
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <MenuItem
                    leftIcon={
                        this.props.collection_data.submitted ? (
                            <SVGReturn />
                        ) : (
                            <SVGTurnedIn />
                        )
                    }
                    primaryText={
                        this.props.collection_data.submitted
                            ? 'Return'
                            : 'Turn in'
                    }
                    onClick={e => {
                        e.stopPropagation();
                        this.props.dispatch(
                            this.props.collection_data.submitted
                                ? Core.actions.action(
                                      'UNSUBMIT_COLLECTION',
                                      [this.props.collection_data._id],
                                      { submitted: false }
                                  )
                                : Core.actions.action(
                                      'SUBMIT_COLLECTION',
                                      [this.props.collection_data._id],
                                      { submitted: true }
                                  )
                        );
                    }}
                />
                <MenuItem
                    leftIcon={
                        this.props.collection_data.completed ? (
                            <SVGClose />
                        ) : (
                            <SVGCheck />
                        )
                    }
                    primaryText={
                        this.props.collection_data.completed
                            ? 'Uncomplete'
                            : 'Complete'
                    }
                    onClick={e => {
                        e.stopPropagation();
                        this.props.dispatch(
                            this.props.collection_data.completed
                                ? Core.actions.action(
                                      'UNCOMPLETE_COLLECTION',
                                      [this.props.collection_data._id],
                                      { completed: false }
                                  )
                                : Core.actions.action(
                                      'COMPLETE_COLLECTION',
                                      [this.props.collection_data._id],
                                      { completed: true }
                                  )
                        );
                    }}
                />
            </IconMenu>
        );
    }
}

function mapStateToProps(state: Collections.IState, ownProps): IStateProps {
    return {
        data_id: ownProps.data_id,
        collection_data: Collections.selectors.data_by_id(
            state,
            ownProps.data_id
        )
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
)(CollectionSubmittedContainer);

{
    /* <Checkbox
onClick={e => {
    e.stopPropagation();
    this.props.dispatch(
        this.props.collection_data.submitted
            ? Core.actions.action(
                  'UNSUBMIT_COLLECTION',
                  [this.props.collection_data._id],
                  { submitted: false }
              )
            : Core.actions.action(
                  'SUBMIT_COLLECTION',
                  [this.props.collection_data._id],
                  { submitted: true }
              )
    );
}}
style={{ display: 'inline-block' }}
checkedIcon={<SVGCheck />}
uncheckedIcon={<SVGClose />}
checked={this.props.collection_data.submitted}
iconStyle={{
    fill: this.props.collection_data.submitted
        ? '#2ecc71'
        : '#e74c3c'
}}
/> */
}

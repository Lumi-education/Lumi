import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// material-ui
import Paper from '@material-ui/core/Paper';

// material-ui -> icons
import SVGLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import SVGRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import SVGMore from 'material-ui/svg-icons/navigation/more-vert';
import SVGComment from 'material-ui/svg-icons/communication/comment';

// actions
import { push } from 'lib/ui/actions';

// types
import { IState } from 'client/state';
import * as Core from 'lib/core';
import * as Flow from 'lib/flow';
import * as Material from 'lib/material';
import * as Comments from 'lib/comments';

declare var window;
const log_info = debug('lumi:info:pages:user:assignment');

interface IStateProps {
    assignment_id: string;
    assignment: Flow.models.Assignment;
    flow: string[];
    // card: (card_id: string) => Cards.ICard;
    user_id: string;
    unread_comments: Comments.models.Comment[];
}

interface IDispatchProps {
    push: (url: string) => void;
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

export class UserFlow extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public componentWillMount() {
        log_info('componentWillMount');

        (window as any).__H5P_USERDATA = this.props.assignment.state
            ? {
                  0: { state: this.props.assignment.state.data }
              }
            : undefined;
    }

    public render() {
        return (
            <div>
                <Paper>
                    <Material.components.H5P
                        content_id={this.props.assignment.material_id}
                        integration={{
                            ajax: {
                                setFinished:
                                    '/api/v1/' +
                                    window.location.pathname.split('/')[1] +
                                    '/flow/assignment/' +
                                    this.props.assignment_id +
                                    '/data',
                                contentUserData:
                                    '/api/v1/' +
                                    window.location.pathname.split('/')[1] +
                                    '/flow/assignment/' +
                                    this.props.assignment_id +
                                    '/state?data_type=:dataType&subContentId=:subContentId'
                            },
                            saveFreq: 10,
                            user: {
                                name: this.props.user_id,
                                mail: this.props.user_id + '@Lumi.education'
                            },
                            contents: {}
                        }}
                    />
                </Paper>

                {/* <BottomNavigation
                    style={{
                        position: 'fixed',
                        bottom: '0px',
                        left: '0px',
                        right: '0px',
                        zIndex: 501
                    }}
                >
                    <BottomNavigationItem
                        onClick={() =>
                            this.props.dispatch(
                                push(
                                    '/user/assignment/' +
                                        this.props.flow[
                                            this.props.flow.indexOf(
                                                this.props.assignment_id
                                            ) - 1
                                        ]
                                )
                            )
                        }
                        style={{
                            display:
                                this.props.flow[0] === this.props.assignment_id
                                    ? 'none'
                                    : 'block'
                        }}
                        icon={<SVGLeft />}
                    /> */}

                {/* <BottomNavigationItem
                        icon={
                            <IconMenu
                                iconButtonElement={
                                    <IconButton>
                                        <SVGMore
                                            color={
                                                this.props.unread_comments
                                                    .length !== 0
                                                    ? '#e67e22'
                                                    : 'black'
                                            }
                                        />
                                    </IconButton>
                                }
                                anchorOrigin={{
                                    horizontal: 'middle',
                                    vertical: 'bottom'
                                }}
                                targetOrigin={{
                                    horizontal: 'middle',
                                    vertical: 'top'
                                }}
                            >
                                <MenuItem
                                    primaryText={Core.i18n.t('comments')}
                                    leftIcon={<SVGComment />}
                                    rightIcon={
                                        <b
                                            style={{
                                                textAlign: 'center',
                                                lineHeight: '24px'
                                            }}
                                        >
                                            {this.props.unread_comments.length}
                                        </b>
                                    }
                                    onClick={() =>
                                        this.props.dispatch(
                                            push(
                                                '/user/assignment/' +
                                                    this.props.assignment_id +
                                                    '/comments'
                                            )
                                        )
                                    }
                                />
                            </IconMenu>
                        }
                    />

                    <BottomNavigationItem
                        onClick={() =>
                            this.props.dispatch(
                                push(
                                    '/user/assignment/' +
                                        this.props.flow[
                                            this.props.flow.indexOf(
                                                this.props.assignment_id
                                            ) + 1
                                        ]
                                )
                            )
                        }
                        style={{
                            display:
                                this.props.flow[this.props.flow.length - 1] ===
                                this.props.assignment_id
                                    ? 'none'
                                    : 'block'
                        }}
                        icon={<SVGRight />}
                    />
                </BottomNavigation> */}
            </div>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        assignment: Flow.selectors.assignment_by_id(
            state,
            ownProps.match.params.assignment_id
        ),
        assignment_id: ownProps.match.params.assignment_id,
        flow: state.users.me.flow || [],
        // card: (card_id: string) => Cards.selectors.select_card(state, card_id),
        user_id: state.users.me._id,
        unread_comments: Comments.selectors.unread(
            state,
            ownProps.match.params.assignment_id,
            state.users.me._id
        )
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
)(UserFlow);

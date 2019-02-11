// modules
import * as React from 'react';
import { connect } from 'react-redux';
import * as debug from 'debug';

// components
import { Dialog, RaisedButton } from 'material-ui';

// local
import { IState } from 'client/state';

// modules
import * as Core from 'lib/core';
import * as UI from 'lib/ui';
import * as Tags from 'lib/tags';

const log = debug('lumi:lib:collections:container:collection-assign-dialog');

interface IPassedProps {}

interface IStateProps extends IPassedProps {
    open: boolean;
    // card: Cards.ICard;
}

interface IDispatchProps {
    dispatch: (action) => any;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class CreateCardDialog extends React.Component<IProps, IComponentState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Dialog
                // title={
                //     this.props.card._id
                //         ? Core.i18n.t('card_edit', {
                //               name: this.props.card.name
                //           })
                //         : Core.i18n.t('card_create')
                // }
                autoScrollBodyContent={true}
                contentStyle={{
                    width: '100%',
                    maxWidth: 'none'
                }}
                // actions={[
                //     <RaisedButton label={Core.i18n.t('cancel')} />,
                //     this.props.card._id ? (
                //         <RaisedButton
                //             label={Core.i18n.t('duplicate')}
                //             // onClick={() =>
                //             //     this.props.dispatch(
                //             //         // Cards.actions.change_card({
                //             //         //     _id: undefined
                //             //         // })
                //             //     )
                //             // }
                //         />
                //     ) : null
                // ]}
                open={this.props.open}
            >
                {/* <Cards.CardEdit /> */}
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        open: false
        // card: state.cards.ui.card
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
)(CreateCardDialog);

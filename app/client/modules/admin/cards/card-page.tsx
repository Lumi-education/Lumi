// modules
import * as React from 'react';
import { connect } from 'react-redux';

// container
import CardEditContainer from 'client/packages/cards/container/card-edit';

// local
import { IState } from 'client/state';

interface IStateProps {
    card_id: string;
}

interface IDispatchProps {
    dispatch: (action) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

export class CardPage extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public componentWillMount() {}

    public componentWillReceiveProps(nextProps: IProps) {}

    public render() {
        return <CardEditContainer card_id={this.props.card_id} />;
    }
}

function mapStateToProps(state: IState, ownProps): IStateProps {
    return {
        card_id: ownProps.params.card_id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: action => dispatch(action)
    };
}

export default connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps)(
    CardPage
);

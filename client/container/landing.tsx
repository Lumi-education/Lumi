// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux';
import { push } 			from '../state/ui/actions';

// local
import { IState }  			from '../state';

interface StateProps {}

interface DispatchProps {}

interface Props extends StateProps, DispatchProps {}

interface State {}

export class Landing extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {};
	}

	public render() {
		return (<div>Hallo</div>);
	}
}

function mapStateToProps(state: IState, ownProps: {}): StateProps {
	return {
	};
}

function mapDispatchToProps(dispatch) {
	return {
	};
}

export default connect<{}, {}, {}>(
	mapStateToProps,
	mapDispatchToProps,
)(Landing);

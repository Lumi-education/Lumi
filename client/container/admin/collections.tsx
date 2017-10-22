// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

// local
import { IState }  			from 'client/state';

interface IStateProps {}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {}

export class AdminCollections extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	public render() {
		return (
			<div style={{ display: 'flex'}}>
				<div style={{ flex: 1 }}>
					<Card style={{ margin: '10px' }}>
						<CardHeader
							title="Without Avatar"
							subtitle="Subtitle"
							actAsExpander={true}
							showExpandableButton={true}
						/>
						<CardActions>
							<FlatButton label="Action1" />
							<FlatButton label="Action2" />
						</CardActions>
						<CardText expandable={true}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
							Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
							Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
						</CardText>
					</Card>
				</div>
				<div style={{ flex: 1 }} />
			</div>
		);
	}
}

function mapStateToProps(state: IState, ownProps: {}): IStateProps {
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
)(AdminCollections);

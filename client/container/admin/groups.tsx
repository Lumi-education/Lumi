// modules
import * as React 			from 'react';
import { connect } 			from 'react-redux';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton 			from 'material-ui/FlatButton';
import { List, ListItem } 	from 'material-ui/List';
import FilterBar 			from 'client/components/filter-bar';
// local
import { IState }  			from 'client/state';

interface IStateProps {}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

interface IComponentState {
	filter: Array<string>;
}

export class AdminGroups extends React.Component<IProps, IComponentState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			filter: []
		};
	}

	public render() {
		return (
			<div>
				<FilterBar filter={this.state.filter} set_filter={(filter) => this.setState({ filter })} />
				<Card style={{ margin: '10px' }}>
					<CardHeader
						title="9a"
						actAsExpander={true}
						showExpandableButton={true}						
					/>
					<CardActions>
						<FlatButton label="edit" />
					</CardActions>
					<CardText expandable={true}>
						<List>
							<ListItem primaryText="1. Azra" />
						</List>
					</CardText>
				</Card>
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
)(AdminGroups);

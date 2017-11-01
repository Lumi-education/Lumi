import * as React 		from 'react';

import TextField 		from 'material-ui/TextField';
import Paper 			from 'material-ui/Paper';

interface IStateProps {
	filter: string;
	set_filter: (filter: string) => void;
}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

interface IState {}

export default class FilterBar extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	render() {
		return (
			<Paper 
				zDepth={1}
				style={{ position: 'fixed', backgroundColor: '#FFFFFF', top: '64px', zIndex: 1099, width: '100%'}}
			>
				<TextField
					fullWidth={true}  
					value={this.props.filter}
					hintText="Search"
					onChange={(e, v) => this.props.set_filter( v )}
				/>
			</Paper>
		);
	}
}
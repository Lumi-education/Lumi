import * as React 		from 'react';

import ChipInput from 'material-ui-chip-input';
import Paper 	from 'material-ui/Paper';

interface IStateProps {
	filter: Array<string>;
	set_filter: (filter: Array<string>) => void;
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
				<ChipInput
					className="filter-bar"
					fullWidth={true}
					inputStyle={{ height: '20px'}}
					underlineShow={false}
					defaultValue={ this.props.filter }
					onChange={this.props.set_filter}
				/>
			</Paper>
		);
	}
}
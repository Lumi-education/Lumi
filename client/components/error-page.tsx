import * as React 		from 'react';

interface IStateProps  {}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

interface IState {}

export default class Error_page extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	componentWillMount() {}

	render() {	
		return (
			<div id="error-page" className="error-page">
					{this.props.children}
			</div>
		);
	}
};
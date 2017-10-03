import * as React 		from "react";

interface IStateProps  {}

interface IDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

interface IState {}

export default class Load_page extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	public componentWillMount() {}

	public render() {
		return (
			<div id="load-page" className="load-page">
					{this.props.children}
			</div>
		);
	}
}

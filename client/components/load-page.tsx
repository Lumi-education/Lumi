import * as React 		from 'react';

interface StateProps  {}

interface DispatchProps {}

interface Props extends StateProps, DispatchProps {}

interface State {}

export default class LoadPage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}
	
	public render() {
		return (
			<div id="load-page" className="load-page">
					{this.props.children}
			</div>
		);
	}
}

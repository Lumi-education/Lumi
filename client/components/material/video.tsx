import * as React from 'react';

import Paper from 'material-ui/Paper';

interface Props {
	url: string;
}

interface State {}

export default class MaterialMarkdown extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		return (
			<div>
				<Paper>
					<video width="320" controls={true}>
						<source src={this.props.url} type="video/mp4" />
						Your browser does not support HTML5 video.
					</video>
				</Paper>
			</div>
		);

	}
}

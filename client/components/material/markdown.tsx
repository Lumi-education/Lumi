import * as React from 'react';

import Paper from 'material-ui/Paper';
import * as markdownit from 'markdown-it';
const md = markdownit();

interface Props {
	markdown: string;
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
					<div 
						dangerouslySetInnerHTML={{
							__html: md.render(this.props.markdown),
						}} 
					/>
				</Paper>
			</div>
		);

	}
}

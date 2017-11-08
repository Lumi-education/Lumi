import * as React 		from 'react';
import { connect } 		from 'react-redux';

import * as markdownit 	from 'markdown-it';
const md = markdownit();

import Paper 			from 'material-ui/Paper';

type Markdown = string;

interface IProps {
	text: Markdown;
	items: Array<Markdown>;
	show_correct_values?: boolean;
}

interface IState {}

export default class MultiplechoiceCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
	}

	public render() {
			return (
			<div>
				<Paper style={{ padding: '20px', margin: '10px' }} >
					<div dangerouslySetInnerHTML={{ __html: md.render(this.props.text || '# No markdown') }} />
				</Paper>

				{
					this.props.items.map((item) =>
						<Paper style={{ padding: '2px', margin: '10px', backgroundColor: backgroundColor(true, item) }}>
							<div dangerouslySetInnerHTML={{ __html: md.render(item.replace(/^x |^o /, '')) || '# No Markdown' }} />
						</Paper>
					)
				}

			</div>
		);

	}
}

function backgroundColor(show_correct_values: boolean, item: string): string {
	if (show_correct_values) {
		if (item.charAt(0) === 'x') { return 'green'; } 
		if (item.charAt(0) === 'o') { return 'red'; }
		return 'blue';
	} else {
		return '#FF00FF';
	}
}
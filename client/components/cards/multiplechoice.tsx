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
	selected_items?: Array<Markdown>;
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
						<Paper 
							style={{ 
								padding: '2px', 
								margin: '10px', 
								backgroundColor: backgroundColor(
										this.props.show_correct_values || false, 
										item,
										this.props.selected_items || []
								) }}
						>
							<div dangerouslySetInnerHTML={{ __html: md.render(item.replace(/^x |^o /, '')) || '# No Markdown' }} />
						</Paper>
					)
				}

			</div>
		);

	}
}

function backgroundColor(show_correct_values: boolean, item: string, selected_items: Array<string>): string {
	if (show_correct_values) {
		if (item.charAt(0) === 'x') { return '#1abc9c'; } 
		if (item.charAt(0) === 'o') { return '#c0392b'; }
		return '#3498db';
	} else {
		if (selected_items.indexOf(item) > -1) { return '#3498db'; } else { return '#FFFFFF'; }
	}
}
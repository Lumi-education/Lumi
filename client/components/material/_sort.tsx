import * as markdownit from 'markdown-it';
import Paper 		from 'material-ui/Paper';
import * as React from 'react';
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';

const md = markdownit();

type Markdown = string;

interface Props {
	task: Markdown;
	items: Array<Markdown>;
	cb: (items: Array<Markdown>) => void;
}

interface State {}

export default class Sort extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.onSortEnd = this.onSortEnd.bind(this);
	}

	public onSortEnd({oldIndex, newIndex}) {
		const items = arrayMove(this.props.items, oldIndex, newIndex);
		this.props.cb(items);
	}

	public render() {
		return (
			<div>
				<Paper style={{ padding: '2px'}}>
					<div dangerouslySetInnerHTML={{ __html: md.render(this.props.task) }} />
				</Paper>
				<SortableList items={this.props.items} onSortEnd={this.onSortEnd} />
			</div>
		);

	}
}

const SortableItem = SortableElement(({value}) => {
	const html = md.render(value);
	return (
		<Paper style={{ margin: '10px', padding: '2px'}} >
			<div dangerouslySetInnerHTML={{ __html: html }} />
		</Paper>
	);
},

);

const SortableList = SortableContainer(({items}) => {
	return (
		<div>
			{items.map((value, index) => (
				<SortableItem key={`item-${index}`} index={index} value={value} />
			))}
		</div>
	);
});

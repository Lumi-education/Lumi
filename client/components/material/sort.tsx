import { assign, isEqual }     	from 'lodash';
import * as markdownit 			from 'markdown-it';
import Paper 					from 'material-ui/Paper';
import * as React 				from 'react';
import { 
	arrayMove, 
	SortableContainer, 
	SortableElement 
} 								from 'react-sortable-hoc';

const md = markdownit();

type Markdown = string;

interface Props {
	task: Markdown;
	material_items: Markdown[];
	user_items: Markdown[];
	cb: (items: Markdown[], score: number) => void;
}

interface State {
	items: string[];
}

export default class MaterialSort extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.onSortEnd = this.onSortEnd.bind(this);
	}

	public componentWillMount() {
		if (!this.props.user_items) {
			this.props.cb(shuffle(this.props.material_items), 0);
		}
	}

	public onSortEnd({oldIndex, newIndex}) {
		const items = arrayMove(this.props.user_items, oldIndex, newIndex);	
		const score = isEqual(this.props.material_items, items) ? 1 : 0;
		this.props.cb(items, score);
	}

	public render() {
		return (
			<div>
				<Paper style={{ padding: '2px'}}>
					<div 
						dangerouslySetInnerHTML={{
							__html: md.render(this.props.task),
						}}
					/>
				</Paper>
				<SortableList items={this.props.user_items || this.props.material_items} onSortEnd={this.onSortEnd} />
			</div>
		);

	}
}

const SortableItem = SortableElement(({value}) => {
	const html = md.render(value);
	return (
		<Paper style={{ margin: '10px', padding: '2px'}}>
			<div dangerouslySetInnerHTML={{ __html: html }} />
		</Paper>
	);
});

const SortableList = SortableContainer(({items}) => {
	return (
		<div>
			{items.map((value, index) => ( <SortableItem key={`item-${index}`} index={index} value={value} /> ))}
		</div>
	);
});

function shuffle(a: Array<string>): Array<string> {
	const array = a.slice(0); // copy array
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		const index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		const temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

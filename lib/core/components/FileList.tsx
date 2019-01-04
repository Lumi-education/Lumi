// modules
import * as React from 'react';
import * as debug from 'debug';
import * as path from 'path';

// components
import { List, ListItem } from 'material-ui';

const log = debug('lumi:cards:components:card-attachment');

interface IPassedProps {
    files: string[];
    onClick?: (file) => void;
}

interface IDispatchProps {}

interface IProps extends IPassedProps, IDispatchProps {}

export default class FileListComponent extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <List>
                    {this.props.files.map(file => (
                        <ListItem
                            onClick={() => this.props.onClick(file)}
                            key={file}
                            primaryText={path.basename(file)}
                        />
                    ))}
                </List>
            </div>
        );
    }
}

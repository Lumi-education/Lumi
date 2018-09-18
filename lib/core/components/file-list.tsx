// modules
import * as React from 'react';
import * as debug from 'debug';

import * as path from 'path';
// components
import Paper from 'material-ui/Paper';

import { List, ListItem, RaisedButton, IconButton } from 'material-ui';
import SVGClose from 'material-ui/svg-icons/navigation/close';

import Dropzone from 'react-dropzone';

import * as request from 'superagent';
// types

// selectors
// actions

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
                            // rightIconButton={
                            //     <IconButton>
                            //         <SVGClose />
                            //     </IconButton>
                            // }
                        />
                    ))}
                </List>
            </div>
        );
    }
}

import * as React from 'react';
import { connect } from 'react-redux';
import { isEqual, pull, noop } from 'lodash';

import { TextField } from 'material-ui';

declare var window;

interface IProps {
    text: string;
    text_change: (text: string) => void;
}

export default class MultiplechoiceEditComponent extends React.Component<
    IProps,
    {}
> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <TextField
                    floatingLabelText="Text"
                    value={this.props.text}
                    onChange={(e, v) => this.props.text_change(v)}
                    fullWidth={true}
                    multiLine={true}
                    rows={5}
                />
            </div>
        );
    }
}

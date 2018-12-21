import * as React from 'react';
// components
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';

import * as AvatarEditor from 'react-avatar-editor';

// modules
import * as Core from 'lib/core';

interface IPassedProps {
    open: boolean;
    avatar_url: string;
    classes: any;
    close: () => void;
    save_image: (image: Blob) => void;
}

interface IDispatchProps {}

interface IProps extends IPassedProps, IDispatchProps {}

interface IComponentState {
    zoom: number;
}

export default class AvatarCropComponent extends React.Component<
    IProps,
    IComponentState
> {
    private editor: any;
    constructor(props: IProps) {
        super(props);

        this.state = {
            zoom: 1
        };

        this.onClickSave = this.onClickSave.bind(this);
        this.setEditorRef = this.setEditorRef.bind(this);
    }

    public onClickSave() {
        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            const canvas = this.editor.getImage();

            canvas.toBlob(image => {
                this.props.save_image(image);
            }, 'image/jpeg');
        }
    }

    public setEditorRef(editor) {
        this.editor = editor;
    }

    public render() {
        const { classes, avatar_url } = this.props;
        return (
            <Dialog open={this.props.open}>
                <DialogContent className={classes.dialogContent}>
                    <AvatarEditor
                        ref={this.setEditorRef}
                        image={this.props.avatar_url}
                        width={250}
                        height={250}
                        borderRadius={200}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={this.state.zoom}
                        rotate={0}
                    />
                    <Slider
                        classes={{ container: classes.slider }}
                        value={this.state.zoom}
                        aria-labelledby="label"
                        onChange={(e, v) => this.setState({ zoom: v })}
                        min={1}
                        max={10}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.close} color="primary">
                        {Core.i18n.t('cancel')}
                    </Button>
                    <Button onClick={this.onClickSave} color="primary">
                        {Core.i18n.t('ok')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

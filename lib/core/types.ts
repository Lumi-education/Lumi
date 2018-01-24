export interface IState {
    core: {
        attachments: IAttachments;
    };
}

export interface IAttachments {
    dialog_open: boolean;
    doc_id: string;
    _attachments;
}

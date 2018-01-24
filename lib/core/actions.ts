export const CORE_SHOW_ATTACHMENT_DIALOG = 'CORE_SHOW_ATTACHMENT_DIALOG';
export const CORE_HIDE_ATTACHMENT_DIALOG = 'CORE_HIDE_ATTACHMENT_DIALOG';

export function show_attachment_dialog(doc_id: string, _attachments) {
    return {
        type: CORE_SHOW_ATTACHMENT_DIALOG,
        payload: { doc_id, _attachments }
    };
}

export function hide_attachment_dialog() {
    return {
        type: CORE_HIDE_ATTACHMENT_DIALOG,
        payload: {}
    };
}

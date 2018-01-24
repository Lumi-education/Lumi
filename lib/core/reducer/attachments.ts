import { assign, unionBy } from 'lodash';

import {
    CORE_HIDE_ATTACHMENT_DIALOG,
    CORE_SHOW_ATTACHMENT_DIALOG
} from '../actions';

import * as Core from '../';

const initialState: Core.types.IAttachments = {
    doc_id: '',
    dialog_open: false,
    _attachments: {}
};

export default function(
    state: Core.types.IAttachments = initialState,
    action
): Core.types.IAttachments {
    switch (action.type) {
        case CORE_SHOW_ATTACHMENT_DIALOG:
            return assign({}, state, {
                dialog_open: true,
                doc_id: action.payload.doc_id,
                _attachments: action.payload._attachments
            });

        case CORE_HIDE_ATTACHMENT_DIALOG:
            return assign({}, state, {
                doc_id: '',
                dialog_open: false,
                _attachments: {}
            });
        default:
            return state;
    }
}

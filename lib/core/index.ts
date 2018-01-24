import * as constants from './constants';
import * as types from './types';
import * as actions from './actions';
export { IState } from './types';
import WebsocketContainer from './container/websocket';
import reducer from './reducer';
import AttachmentComponent from './components/attachment';
import AttachmentListContainer from './container/attachment-list';

const components = {
    attachment: AttachmentComponent
};

const container = {
    websocket: WebsocketContainer,
    attachmentList: AttachmentListContainer
};

export { actions, constants, types, container, components, reducer };

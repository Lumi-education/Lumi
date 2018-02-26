import * as constants from './constants';
import * as types from './types';
import * as actions from './actions';
export { IState } from './types';
import WebsocketContainer from './container/websocket';
import reducer from './reducer';
import AttachmentComponent from './components/attachment';
import AttachmentListContainer from './container/attachment-list';
import FetchContainer from './container/fetch';

const components = {
    attachment: AttachmentComponent
};

const container = {
    websocket: WebsocketContainer,
    attachmentList: AttachmentListContainer,
    Fetch: FetchContainer
};

export { actions, constants, types, container, components, reducer };

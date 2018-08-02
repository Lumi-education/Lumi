import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

export { IState } from './types';
import WebsocketContainer from './container/websocket';
import reducer from './reducer';
import AttachmentComponent from './components/attachment';
import SystemContainer from './container/system';

const components = {
    attachment: AttachmentComponent
};

const container = {
    websocket: WebsocketContainer,
    System: SystemContainer
};

export { actions, selectors, types, container, components, reducer };

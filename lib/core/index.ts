import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

import FileListComponent from './components/file-list';
import WebsocketContainer from './container/websocket';
import Markdown from './components/markdown';
import reducer from './reducer';
import SystemContainer from './container/system';
import FileUploadComponent from './components/file-upload';
import * as utils from './utils';
import * as config from './config';
const components = {
    Markdown,
    FileUpload: FileUploadComponent,
    FileList: FileListComponent
};

const container = {
    websocket: WebsocketContainer,
    System: SystemContainer
};

export {
    actions,
    selectors,
    types,
    container,
    components,
    reducer,
    utils,
    config
};

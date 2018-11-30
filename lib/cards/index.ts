export { default as CardViewContainer } from './container/card-view';
import { default as CardTypeComponent } from './components/card-type';
import { default as CardPreview } from './components/card-preview';
import { default as CardScoreComponent } from './components/card-score';
import { default as Multiplechoice } from './components/multiplechoice';
import { default as CardComponent } from './components/card';
export { default as CardEdit } from './container/card-edit';
export {
    IState,
    ICardUI,
    ICard,
    IFreetextCard,
    IMultiplechoiceCard,
    ITextCard,
    IUploadCard,
    IVideoCard,
    IH5PCard
} from './types';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import * as types from './types';

const components = {
    Multiplechoice,
    CardPreview,
    CardType: CardTypeComponent,
    CardScore: CardScoreComponent,
    Card: CardComponent
};

export { actions, reducer, selectors, components, types };

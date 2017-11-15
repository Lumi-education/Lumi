import { IState } from 'client/state';
import { Dispatch } from 'redux';
import { assign } from 'lodash';

export default function callAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        const {
            types,
            api,
            shouldCallAPI = (state: IState) => true,
            payload = {}
        } = action;

        if (!types) {
            return next(action);
        }

        if (
            !Array.isArray(types) ||
            types.length !== 3 ||
            !types.every(type => typeof type === 'string')
        ) {
            throw new Error('Expected an array of three string types.');
        }

        if (!shouldCallAPI(getState())) {
            return;
        }

        const [requestType, successType, failureType] = types;

        dispatch(
            assign({}, payload, {
                type: requestType
            })
        );

        return api.then(
            response =>
                dispatch(
                    assign({}, payload, {
                        response,
                        payload: response.body,
                        type: successType
                    })
                ),
            error =>
                dispatch(
                    assign({}, payload, {
                        response: error,
                        payload: error.body,
                        type: failureType
                    })
                )
        );
    };
}

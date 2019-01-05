import { IState } from 'client/state';
import { assign } from 'lodash';
import * as Core from 'lib/core';

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
            const error = new Error('Expected an array of three string types.');
            Core.raven.captureException(error);
            throw error;
        }

        if (!shouldCallAPI(getState())) {
            return;
        }

        const [requestType, successType, failureType] = types;

        dispatch(
            assign(
                {},
                { payload },
                {
                    type: requestType
                }
            )
        );

        return api.then(
            response => {
                try {
                    dispatch(
                        response.header || response.headers
                            ? assign({}, payload, {
                                  response,
                                  payload: response.body,
                                  type: successType
                              })
                            : {
                                  payload: response,
                                  type: successType
                              }
                    );
                } catch (error) {
                    Core.raven.captureException(error);
                    dispatch({
                        type: 'CORE_ACTION_ERROR',
                        payload: error
                    });
                }
            },

            error => {
                dispatch(
                    assign({}, payload, {
                        response: error,
                        payload: error.body,
                        type: failureType
                    })
                );
            }
        );
    };
}

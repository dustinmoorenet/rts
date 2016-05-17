import expect from 'expect';

import spyStore from 'js/tests/utils/spyStore';
import {
    goTo,
} from 'js/Sprite/actions';

const initialState = {
    timeMachine: {
        time: 500,
        lastTime: 0,
    },
    population: {
        1: {
            id: 1,
            x: 100,
            y: 100,
            walkRate: 10,
            tasks: [],
        },
    },
};

describe('Sprite/actions', () => {
    describe('goTo', () => {
        it('should go down and to the right', () => {
            const {dispatch, getState, getActions} = spyStore(initialState);
            const unit = getState().population[1];

            dispatch(goTo(unit, {x: 140, y: 130}));

            expect(getActions()).toEqual([
                {
                    payload: {
                        id: 1,
                        props: {
                            tasks: [
                                {
                                    type: 'goTo',
                                    x: 140,
                                    y: 130,
                                },
                            ],
                            x: 104,
                            y: 103,
                        },
                    },
                    type: 'population/UPDATE_UNIT',
                },
            ]);
        });

        it('should go up and to the right', () => {
            const {dispatch, getState, getActions} = spyStore(initialState);
            const unit = getState().population[1];

            dispatch(goTo(unit, {x: 140, y: 70}));

            expect(getActions()).toEqual([
                {
                    payload: {
                        id: 1,
                        props: {
                            tasks: [
                                {
                                    type: 'goTo',
                                    x: 140,
                                    y: 70,
                                },
                            ],
                            x: 104,
                            y: 97,
                        },
                    },
                    type: 'population/UPDATE_UNIT',
                },
            ]);
        });

        it('should go up and to the left', () => {
            const {dispatch, getState, getActions} = spyStore(initialState);
            const unit = getState().population[1];

            dispatch(goTo(unit, {x: 60, y: 70}));

            expect(getActions()).toEqual([
                {
                    payload: {
                        id: 1,
                        props: {
                            tasks: [
                                {
                                    type: 'goTo',
                                    x: 60,
                                    y: 70,
                                },
                            ],
                            x: 96,
                            y: 97,
                        },
                    },
                    type: 'population/UPDATE_UNIT',
                },
            ]);
        });

        it('should go down and to the left', () => {
            const {dispatch, getState, getActions} = spyStore(initialState);
            const unit = getState().population[1];

            dispatch(goTo(unit, {x: 60, y: 130}));

            expect(getActions()).toEqual([
                {
                    payload: {
                        id: 1,
                        props: {
                            tasks: [
                                {
                                    type: 'goTo',
                                    x: 60,
                                    y: 130,
                                },
                            ],
                            x: 96,
                            y: 103,
                        },
                    },
                    type: 'population/UPDATE_UNIT',
                },
            ]);
        });
    });
});

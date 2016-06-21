/*
to eat
hunger scale is 0 to 1
need to have hunger above a value like .8 to be 'hungry'
if hungry then search for food
consult known food map descret points on map of last known food
if food known then go to food
if no food known then look for food
if went to known food location and found no food then update food map
if at food then eat

if eat then food source decreases and subject hunger down, energy up and happiness up

to grow
plant (asexual): a plant will spontainously grow at points on the map with fertal
  soil and that are adjacent to other plants of the same type
animal (sexual): an animal will be the product of two other animals of the same kind
  A male will seek out a female when both are ready and know of each other


Need:
ability to find things on map
store information in separate maps (food, people, dangers)
store hunger, energy, aroused levels

Want:
heat map of locations that are good and bad by taking other maps and adding up to sum value
derived happiness level from other information like if located in happy place and
hunger and energy levels are up
*/

import {goTo} from 'js/Sprite/actions';

export function findFood(id) {
    return (dispatch, getState) => {
        const state = getState();
        const unit = state.population[id];
        const {
            width: mapWidth,
            height: mapHeight,
        } = state.map;
        const position = {};

        if (unit.x !== 0) {
            position.x = 0;
        }

        if (unit.x !== mapWidth) {
            position.x = mapWidth;
        }

        if (unit.z !== 0) {
            position.x = 0;
        }

        if (unit.z !== mapHeight) {
            position.z = mapHeight;
        }

        dispatch(goTo(id, 0, position));
    };
}

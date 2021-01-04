import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { LinkStateInterface } from './state';

const getters: GetterTree<LinkStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default getters;

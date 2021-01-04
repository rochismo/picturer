import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { LinkStateInterface } from './state';

const actions: ActionTree<LinkStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default actions;

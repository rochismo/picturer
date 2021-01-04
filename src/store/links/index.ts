import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { LinkStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const linksModule: Module<LinkStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default linksModule;

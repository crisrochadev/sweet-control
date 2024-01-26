import { useSessionStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useAuth = defineStore('auth', {
  state: () => ({
    session:useSessionStorage('app-session', null)
  }),

});

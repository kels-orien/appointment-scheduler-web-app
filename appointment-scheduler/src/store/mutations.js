import {
  ALL_SLOTS,
  ALL_SLOTS_SUCCESS
} from './mutation-types'
export const slotMutations = {
  [ALL_SLOTS] (state) {
  },
  [ALL_SLOTS_SUCCESS] (state, payload) {
    state.slots = payload
  }
}

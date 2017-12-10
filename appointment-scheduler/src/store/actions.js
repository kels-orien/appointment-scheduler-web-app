import axios from 'axios'
import { API_BASE } from '../config'

import {
  ALL_SLOTS,
  ALL_SLOTS_SUCCESS
} from './mutation-types'

export const slotActions = {
  allSlots({ commit }) {
    commit(ALL_SLOTS)
    axios.get(`${API_BASE}/retrieveSlots`).then(response => {
      console.log('response via store: ', response.data)
      commit(ALL_SLOTS_SUCCESS, response.data)
    })
  }
}

import axios from 'axios'
import {API_BASE} from '../config'

import {
  ALL_SLOTS,
  ALL_SLOTS_SUCCESS,
  ADD_APPOINTMENT,
  ADD_APPOINTMENT_SUCCESS
} from './mutation-types'

export const appointmentActions = {
  addAppointment ({commit}, payload) {
    commit(ADD_APPOINTMENT)
    axios.post(`${API_BASE}/appointmentCreate`, payload).then(response => {
      commit(ADD_APPOINTMENT_SUCCESS, response.data)
    })
  }
}

export const slotActions = {
  allSlots ({commit}) {
    commit(ALL_SLOTS)
    axios.get(`${API_BASE}/retrieveSlots`).then(response => {
      console.log('response via store: ', response.data)
      commit(ALL_SLOTS_SUCCESS, response.data)
    })
  }
}

<template>
<v-app light>
  <v-toolbar dark color="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title class="white--text">Appointment Scheduler</v-toolbar-title>
  </v-toolbar>
  <v-content>
    <v-container grid-list-xl text-xs-center>
  <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-stepper v-model="e6" vertical>
            <v-stepper-step step="1" v-bind:complete="e6 > 1" complete editable>
              Choose a day for your appointment</v-stepper-step>

            <v-stepper-content step="1">

              <v-flex xs11 sm5>
                <v-dialog persistent v-model="modal" lazy full-width>
                  <v-text-field slot="activator" label="Select Date" v-model="date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="date" :allowed-dates="allowedDates" scrollable actions>
                    <template scope="{ save, cancel }">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                <v-btn flat color="primary"  @click.native="e6 = 2"  @click="save">OK</v-btn>
              </v-card-actions>
            </template>
                  </v-date-picker>
                </v-dialog>
              </v-flex>
            </v-stepper-content>
            <v-stepper-step step="2" complete editable v-bind:complete="e6 > 2">Choose an available time for your appointment</v-stepper-step>
            <v-stepper-content step="2">
              <v-flex xs11 sm5>
                <v-select
                v-bind:items="items"
                v-model="e1"
                label="Select"
                item-value="text"
                single-line
                bottom
              ></v-select>
              </v-flex>
              <v-radio-group v-model="selected"  v-show="ok"  v-on:change="formatDate">
                <v-radio v-for = "slot in availableAMs" :key= "slot.id" :label="`${slot.time}`" @click.native="e6 = slot.step" :value="`${slot.time}`" :disabled="slot.state"></v-radio>
              </v-radio-group>


              <v-radio-group  v-model="selected" v-show="collapsed" v-on:change="formatDate">
                <v-radio v-for = "slot in availablePMs" :key= "slot.id" :label="`${slot.time}`" @click.native="e6 = slot.step" :value="`${slot.time}`" :disabled="slot.state"></v-radio>
              </v-radio-group>
            </v-stepper-content>
            <v-stepper-step step="3" complete editable v-bind:complete="e6 > 3">Share your contact information with us and we 'll send you a reminder</v-stepper-step>
            <v-stepper-content step="3">
              <form  ref="form">
              <v-text-field name="firstname" label="First Name" v-model="firstname" v-validate ="'required|alpha'" />
              <span v-show="errors.has('firstname')" class="error_msg">{{ errors.first('firstname') }}</span>

              <v-text-field name="lastname" label="Last Name"  v-model="lastname" v-validate ="'required|alpha'"/>
              <span v-show="errors.has('lastname')" class="error_msg">{{ errors.first('lastname') }}</span>

              <v-text-field name="email" label="Email" v-model="email" v-validate="'required|email'"></v-text-field>
              <span v-show="errors.has('email')" class="error_msg">{{ errors.first('email') }}</span>

              <v-text-field name="phone" label="Phone" v-model="phone" v-validate="'required|numeric'" />
                <span v-show="errors.has('phone')" class="error_msg">{{ errors.first('phone') }}</span>
                <v-spacer></v-spacer>
              <v-btn block color="primary"@click ="submit" @click.native="e6 = 0">SCHEDULE</v-btn>
            </form>
            <v-dialog v-model = "dialog" persistent max-width ="750">
              <v-card>
                <div v-for="user in userArray">
                <v-spacer></v-spacer>
                <v-flex xs12 sm6 md4>
                    <v-spacer></v-spacer>
                  <span>Name: {{user.name}}</span>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-spacer></v-spacer>
                  <span>Email: {{user.email}}</span>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-spacer></v-spacer>
                  <span>Phone: {{user.phone}}</span>
                </v-flex>
                <v-flex xs12 sm6 md4>
                    <v-spacer></v-spacer>
                  <span>Appointment: {{user.appointment}}</span>
                </v-flex>
              </div>
                <v-card-actions>
                   <v-spacer></v-spacer>
                   <v-btn color="blue darken-1" flat @click.native="dialog = false">Confirm</v-btn>
                 </v-card-actions>
            </v-card>
          </v-dialog>
            </v-stepper-content>
          </v-stepper>
        </v-card>

      </v-flex>
      </v-layout>
    </v-container>
  </v-content>

  <v-footer app></v-footer>
</v-app>
</template>

<script>
/* eslint-disable*/
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'AppointmentScheduler',
  data () {
    return {
      date: null,
      time: null,
      modal: null,
      modal2: null,
      dialog: false,
      loading: false,
      e6: null,
      e1: null,
      allowedDates: null,
      select: null,
      selectedSlots: [],
      availableAMs: [
        { id: 1, time: '9:00am - 10:00 am', step: 3, state: false },
        { id: 2, time: '10:00am - 11:00 am', step: 3, state: false },
        { id: 3, time: '11:00am - 12:00 pm', step: 3, state: false }
      ],
      availablePMs: [
        { id: 4, time: '12:00pm - 1:00 pm', step: 3, state: false },
        { id: 5, time: '1:00pm - 2:00 pm', step: 3, state: false },
        { id: 6, time: '2:00am - 3:00 pm', step: 3, state: false },
        { id: 7, time: '3:00pm - 4:00 pm', step: 3, state: false },
        { id: 8, time: '4:00am - 5:00 pm', step: 3, state: false }
      ],
      userArray: {},
      selected: null,
      ok: null,
      collapsed: null,
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      appointment: '',
      items: [
        { text: 'AM' },
        { text: 'PM' }
      ],
      availableDays: {
        min: null,
        max: null
      }
    }
  },
  created () {
    this.$store.dispatch('allSlots')
  },
  mounted () {
    this.setAvailableDays()
  },
  beforeUpdate () {
    this.setTimeFormat()
  },
  updated () {
  },
  methods: {
    formatDate () {
      console.log('date for appointment:', moment(this.date, 'YYYY/MM/DD').format('DD/MM/YYYY'))
      console.log('Time for appointment:', this.selected)
      const day = moment(this.date, 'YYYY/MM/DD').format('dddd')
      const daynumber = moment(this.date, 'YYYY/MM/DD').format('Do')
      const month = moment(this.date, 'YYYY/MM/DD').format('MMMM')
      const year = moment(this.date, 'YYYY/MM/DD').format('YYYY')
      this.appointment = day + '    ' + daynumber + '    ' + month + '    ' + year + '   ' + 'between' + '   ' + this.selected
    },
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.addToDB()
          return
        }alert('Correct the errors!')
      })
    },
    setTimeFormat () {
      if (this.e1 === 'AM') {
        this.ok = true
        this.collapsed = null
        this.updateSlots()
        console.log('value', this.e1)
        this.e1 = null
      } else if (this.e1 === 'PM') {
        this.collapsed = true
        this.ok = null
        this.updateSlots()
        console.log('value', this.e1)
        this.e1 = null
      }
    },
    setAvailableDays () {
      const nowdate = new Date()
      const todaydate = new Date()
      const endofyear = new Date(todaydate.getFullYear(), 12, 31)
      const singleday = 1000 * 60 * 60 * 24
      const remainingdays = Math.ceil((endofyear.getTime() - todaydate.getTime()) / singleday)
      todaydate.setDate(nowdate.getDate() + remainingdays)
      this.availableDays.min = nowdate
      this.availableDays.max = todaydate

      this.allowedDates = this.availableDays
    },
    addToDB () {
      this.loading = true
      let newappointment = {
        name: this.firstname + ' ' + this.lastname,
        email: this.email,
        phone: this.phone,
        appointment: this.appointment,
        slot_time: this.selected,
        slot_date: this.date
      }
      axios.post('http://localhost:3000/api/appointmentCreate', newappointment)
        .then((response) => {
          console.log(response)
          this.loading = false
          this.confirmUser()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    confirmUser () {
      this.userArray = [{
        name: this.firstname + ' ' + this.lastname,
        email: this.email,
        phone: this.phone,
        appointment: this.appointment
      }]
      this.dialog = true
      this.clearFields()
    },
    clearFields () {
      this.date = null
      this.selected = null
      this.firstname = null
      this.lastname = null
      this.email = null
      this.phone = null
    },
    setSlots () {
      if (this.$store.getters.allSlots.length > 0) {
        this.selectedSlots = this.$store.getters.allSlots
      }
    },
    updateSlots () {
      if (this.date !== null) {
        this.setSlots()
        this.setmode = true
        if (this.selectedSlots !== null) {
           console.log('selected slot via database: ', this.selectedSlots)
          if (this.e1 === 'AM') {
            for (var i = 0; i < this.selectedSlots.length; ++i) {
              for (var x = 0; x < this.availableAMs.length; ++x) {
                if (this.date === this.selectedSlots[i].slot_date) {
                  if (this.availableAMs[x].time === this.selectedSlots[i].slot_time) {
                    this.availableAMs[x].state = 'disabled'
                    this.availableAMs[x].step = null
                  }
                }
              }
            }
          }
          else if (this.e1 === 'PM') {
            for (var t = 0; t < this.selectedSlots.length; ++t) {
              for (var y = 0; y < this.availableAMs.length; ++y) {
                if (this.date === this.selectedSlots[i].slot_date) {
                  if (this.availableAMs[y].time === this.selectedSlots[t].slot_time) {
                    this.availableAMs[y].state = 'disabled'
                    this.availableAMs[y].step = null
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

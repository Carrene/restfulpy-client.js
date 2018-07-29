<template>
  <div class="login">
    <form @submit.prevent="login" class="form">
      <input type="text" class="input" placeholder="Email Address" v-model="email">
      <input type="password" class="input" placeholder="Password" 
      v-model="pssword" > 
      <button type="submit" class="button"> Login </button>
    </form>
  </div>
</template>

<script>
import server from './../server'

export default {
  name: 'Login',
  data () {
    return {
      email: null,
      password: null,
      status: null
    }
  },
  methods: {
    login () {
      server.request('sessions').setVerb('POST').addParameters({email: this.email, password:
      this.password}).send().then(resp => {
        this.status = resp.status
        console.log(this.status)
      })
    }
  }
}
</script>


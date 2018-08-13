<template>
  <div class="login">
    <div class="body">
      <h2 class="header">Login</h2>
      <form @submit.prevent="login" class="form" v-if="!success">
        <input type="text" class="input" placeholder=" Email Address" v-model="email">
        <input type="password" class="input" placeholder=" Password" v-model="password">
        <button type="submit" class="button"> Login </button>
        <p v-if="hasError">Invalid Email or Password!</p>
      </form>
      <p  v-else>Welcome</p>
    </div>
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
      token: null,
      hasError: false,
      success: false
    }
  },
  methods: {
    login () {
      server.login(this.email, this.password).then(resp => {
        if (resp.status === 200) {
          this.success = true
        }
      }).catch(() => {
        this.hasError = true
      })
    }
  }
}
</script>

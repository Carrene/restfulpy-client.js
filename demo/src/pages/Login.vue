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
export default {
  name: 'Login',
  data () {
    return {
      email: null,
      password: null
    }
  },
  methods: {
    login () {
      console.log(this.email)
    }
  }
}
</script>


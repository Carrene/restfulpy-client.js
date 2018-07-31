<template>
  <div class="resource">
    <form @submit.prevent="update" class="form">
      <input type="text" class="input" placeholder="Title" v-model="resource.title">
      <button type="submit" class="button"> Update </button>
    </form>
    {{ resource }}
  </div>
</template>

<script>
import server from './../server'

export default {
  data () {
    return {
      resource: new server.metadata.models.Resource()
    }
  },
  methods: {
    update () {
      console.log('Update')
    }
  },
  mounted () {
    console.log(this.resource)
    server.metadata.models.Resource.get('1').then(resp => {
      console.log(resp)
    })
  }
}
</script>

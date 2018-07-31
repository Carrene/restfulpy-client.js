<template>
  <div class="resource">
    <form @submit.prevent="update" class="form">
      <h3>Form</h3>
      <div class="title">
        <label for="title">{{ Resource.fields.title.label }}</label>
        <input
          id="title"
          type="text"
          class="input"
          :placeholder="Resource.fields.title.watermark"
          v-model="$v.resource.title.$model"
          :class="$v.resource.title.$error ? 'error' : null"
        >
      </div>
      <div content="buttons">
        <button
          v-if="resource.__status__ === 'new'"
          :disabled="$v.resource.title.$invalid"
          type="submit"
        >
          Save
        </button>
        <button
          v-else
          type="submit"
          :disabled="$v.resource.title.$invalid || resource.__status__ === 'loaded'"
        >
          Update
        </button>
        <button type="button" @click="reload">Reload</button>
        <button type="button" @click="deleteResource">Delete</button>
      </div>
    </form>

    <div>
      <h3>Selected Resource</h3>

      {{ resource }}
    </div>

    <table>
      <caption>Resources</caption>
      <tr>
        <th>ID</th>
        <th>Title</th>
      </tr>
      <tr v-for="singleResource in resources" :key="singleResource.id" @click="resource = singleResource">
        <td>{{ singleResource.id }}</td>
        <td>{{ singleResource.title }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import server from './../server'

export default {
  data () {
    return {
      resource: new server.metadata.models.Resource(),
      Resource: server.metadata.models.Resource,
      resources: []
    }
  },
  validations () {
    return {
      resource: {
        title: server.metadata.models.Resource.fields.title.createValidator()
      }
    }
  },
  mounted () {
    this.updateResources()
  },
  methods: {
    update () {
      this.resource.save().send().then(resp => {
        if (resp.status === 200) {
          this.resource = resp.models
          this.updateResources()
        }
      })
    },
    updateResources () {
      server.metadata.models.Resource.load().send().then(resp => {
        this.resources = resp.models
      })
    },
    reload () {
      this.resource.reload().send().then(resp => {
        this.resource = resp.models
      })
    },
    deleteResource () {
      this.resource.delete().send().then(resp => {
        if (resp.status === 200) {
          this.updateResources()
        }
      })
    }
  }
}
</script>

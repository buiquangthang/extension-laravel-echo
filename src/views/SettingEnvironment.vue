<template>
  <div class="container-fluid">
    <h1 class="h3 mb-2 text-gray-800">Setting Environment</h1>
    <button class="btn btn-primary mb-4" @click="showModal">Add new</button>

    <Modal v-show="isModalVisible" @close="closeModal" v-on:input="handleChange"/>

    <div class="row">
      <div class="col-lg-6">
        <div class="card shadow mb-4">
          <div class="card-header py-3" style="display: flex; align-items: center;justify-content: space-between;">
            <h6 class="m-0 font-weight-bold text-primary">Enviroment Variable</h6>

            <button class="btn btn-danger">Delete</button>
          </div>

          <div class="card-body">
            <editable :data="{ columns, options }"></editable>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Socket IO options</h6>
          </div>

          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First</th>
                  <th scope="col">Last</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-for="(environment, index) in environments" v-bind:key="index">
        <div class="col-lg-6">
          <div class="card shadow mb-4">
            <div class="card-header py-3" style="display: flex; align-items: center;justify-content: space-between;">
              <h6 class="m-0 font-weight-bold text-primary">{{ environment }}</h6>

              <button class="btn btn-danger">Delete</button>
            </div>

            <div class="card-body">
              <editable :data="{ columns, options }"></editable>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import Editable from '@/components/Editable/Editable.vue'
import Modal from '@/components/Modal/Modal.vue'

export default {
  name: 'setting',
  components: {
    Editable,
    Modal
  },
  data () {
    return {
      isModalVisible: false,
      environments: JSON.parse(localStorage.getItem('collection_environment')) || [],
      columns: [
        {
          title: 'Id',
          name: 'id',
          editable: true,
          show: true
        },
        {
          title: 'Variable',
          name: 'variable',
          editable: true
        },
        {
          title: 'Value',
          name: 'value',
          editable: true
        }
      ],
      options: {
        showSearchFilter: false,
        requests: {
          getUrl: 'https://reqres.in/api/users',
          postUrl: 'https://reqres.in/api/users',
          patchUrl: 'https://reqres.in/api/users',
          deleteUrl: 'https://reqres.in/api/users'
        }
      }
    }
  },

  methods: {
    showModal () {
      this.isModalVisible = true
    },
    closeModal () {
      this.isModalVisible = false
    },
    handleChange (event) {
      this.environments.push(event)
    }
  }
}
</script>

<template>
  <div class="container-fluid">
    <h1 class="h3 mb-2 text-gray-800">Setting Environment</h1>

    <p class="mb-4">DataTables is a third party plugin that is used to generate the demo table below.
                        For more information about DataTables, please visit the <a target="_blank" href="https://datatables.net">official DataTables documentation</a>.</p>
    <div class="row">
      <div class="col-lg-6">
        <div class="card shadow mb-4">
          <div class="card-header py-3" style="display: flex; align-items: center;justify-content: space-between;">
            <h6 class="m-0 font-weight-bold text-primary">Enviroment Variable</h6>

            <button class="btn btn-primary">Add new</button>
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
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Editable from '@/components/Editable/Editable.vue'

export default {
  name: 'setting',
  components: {
    Editable
  },
  data () {
    return {
      columns: [
        {
          title: 'Id',
          name: 'id',
          editable: false
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
        },
      ],
      options: {
        showSearchFilter: false,
        requests: {
          getUrl: 'https://reqres.in/api/users'
        }
      }
    }
  }
}
</script>

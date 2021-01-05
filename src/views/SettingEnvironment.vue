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
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Socket IO options</h6>
          </div>

          <div class="card-body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'setting'
}
</script>

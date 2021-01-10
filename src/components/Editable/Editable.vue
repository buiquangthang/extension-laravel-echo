<template>
  <div>
    <div id="lodingScreen" v-if="loading">
      <icon name="refresh" spin class="refresh"></icon>
    </div>

    <div id="showColumnsModal" @click.self="setShowColumnsModal()" v-show="showColumnsModal" v-if="customdark">
      <ul>
        <span @click="setShowColumnsModal()">
          <icon name="times" class="modalTimes"></icon>
        </span>
        <li v-for="(col, index) in cols" v-bind:key="index">
          <input type="checkbox" :name="col.name" :id="col.name" v-model="col.show" @change="updateShowColumns(index)">
          <label :for="col.name">{{ col.name }}</label>
        </li>
      </ul>
    </div>

    <div id="top-menu">
      <div class="vet-btn-group">
        <a role="button" class="vet-btn" @click="addRow()" v-if="customdark">
          <icon name="plus" class="plus"></icon>
          New
        </a>
        <a role="button" class="vet-btn" @click="deleteRow()" v-if="customdark">
          <icon name="trash" class="trash"></icon>
          Delete
        </a>
        <input
        type="text"
        name="query"
        v-model="filterKey"
        placeholder="Search"
        ref="search"
        id="search"
        v-if="opt.showSearchFilter && customdark">
      </div>
    </div>

    <table class="editable table" ref="table">
      <thead>
        <tr>
          <th v-for="col in cols" v-bind:key="col" v-show="!col.hidden && col.show" ref="tableHead">
          {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(row, rowIndex) in filteredData" v-bind:key="rowIndex"
          @click="setSelection(filteredData[rowIndex].id.value, $event)"
          :class="[selectedRowArray.indexOf(filteredData[rowIndex].id.value) >= 0 ? 'activeRow' : '']">
          <td v-for="(cell, key, index) in row" v-bind:key="index"
            @click="setTarget(rowIndex, key)"
            v-show="!cell.isHidden && cell.show"
            :class="[cell.isActive ? 'activeCell' : '']"
            :data-th="key">
            <div class="cell-wrapper">
              <div class="dsdf" v-show="!cell.isActive || !cell.isEditable" ref="span">{{ cell.value }}</div>
              <input
                :type="key == 'id' ? 'checkbox' : 'text'"
                name="cell"
                spellcheck="false"
                v-show="cell.isActive && cell.isEditable"
                v-model="thisCell.value"
                @change="saveData(rowIndex, key, thisCell.value, filteredData[rowIndex].id.value, $event)"
                @keydown.shift.left="selectCell(rowIndex, index, $event)"
                @keydown.shift.right="selectCell(rowIndex, index, $event)"
                @keydown.up="selectCell(rowIndex, index, $event)"
                @keydown.down="selectCell(rowIndex, index, $event)"
                :class="[cell.isActive ? 'activeCell' : '']"
                ref="inputFields">
              <div v-show="savingIndex == rowIndex && savingKey == key" class="spinner-wrapper">
                <icon name="spinner" spin class="spinner"></icon>
              </div>
            </div>
            <div v-if="cell.hasErrors.length > 0" class="validation-error">{{ cell.hasErrors[0] }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script src="./editable.js"></script>
<style src="./editable_bootstrap.css"></style>
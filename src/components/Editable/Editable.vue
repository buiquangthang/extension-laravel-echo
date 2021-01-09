<template>
  <div id="wrapper" ref="wrapper" :class="customdark && 'open-sans'">
    <div id="container">

      <div id="lodingScreen" v-if="loading">
        <icon name="refresh" spin class="refresh"></icon>
      </div>

      <v-toolbar class="secondary vet-toolbar" light v-if="vuetify">
        <v-btn icon light @click.native="addRow()" v-tooltip:bottom="{ html: 'Create new row' }">
          <v-icon>create</v-icon>
        </v-btn>
        <v-btn icon light @click.native="deleteRow()" v-tooltip:bottom="{ html: 'Delete row' }">
          <v-icon>delete</v-icon>
        </v-btn>
          <v-dialog v-model="showColumnsModal">
            <v-btn icon light slot="activator" v-tooltip:bottom="{ html: 'Show/Hide columns' }">
              <v-icon>remove_red_eye</v-icon>
            </v-btn>
            <v-card class="modal-card">
              <v-card-row>
                <v-card-title>Show/Hide Column</v-card-title>
              </v-card-row>
              <v-card-row >
                <v-card-text>
                   <v-checkbox
                    v-for="(col, index) in cols"
                    :label="col.name"
                    :name="col.name"
                    v-model="col.show"
                    @change="updateShowColumns(index)"
                    :key="col.name"
                    dark>
                  </v-checkbox>
                </v-card-text>
              </v-card-row>
            </v-card>
          </v-dialog>
        <v-text-field
          append-icon="search"
          name="query"
          label="Search..."
          hide-details
          single-line
          light
          ref="search"
          v-model="filterKey"
          v-if="opt.showSearchFilter">
        </v-text-field>
        <v-btn icon light :disabled="!leftSwipable" @click.native="leftSwipable && swipeLeft()" v-tooltip:bottom="{ html: 'Swipe left' }">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-btn icon light :disabled="!rightSwipable" @click.native="rightSwipable && swipeRight()" v-tooltip:bottom="{ html: 'Swipe right' }">
          <v-icon>arrow_forward</v-icon>
        </v-btn>
      </v-toolbar>

      <div id="showColumnsModal" @click.self="setShowColumnsModal()" v-show="showColumnsModal" v-if="customdark">
        <ul>
          <span @click="setShowColumnsModal()">
            <icon name="times" class="modalTimes"></icon>
          </span>
          <li v-for="(col, index) in cols">
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
          <a role="button" class="vet-btn" @click="setShowColumnsModal()" v-if="customdark">
            <icon name="eye" class="eye"></icon>
            Show
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
        <div class="vet-btn-group swipe-btns">
          <a role="button" :class="[leftSwipable ? 'vet-btn' : 'vet-btn disabled']" @click="leftSwipable && swipeLeft()" v-if="customdark">
            <icon name="arrow-left" class="arrow-left"></icon>
          </a>
          <a role="button" :class="[rightSwipable ? 'vet-btn' : 'vet-btn disabled']" @click="rightSwipable && swipeRight()" v-if="customdark">
            <icon name="arrow-right" class="arrow-right"></icon>
          </a>
        </div>
      </div>

      <table :class="{ 'custom-dark': customdark, 'datatable table': vuetify }" ref="table">
        <thead>
          <tr>
            <th v-for="col in cols"
            @click="sortBy(col.name, $event)"
            :class="{ active: sortArray.indexOf(col.name) >= 0, 'align-l column sortable': vuetify, asc: sortOrders[col.name] > 0, desc: sortOrders[col.name] <= 0 }"
            v-show="!col.hidden && col.show"
            ref="tableHead">
            {{ col.title }}
            <span>
              <icon v-if="customdark" :name="sortOrders[col.name] > 0 ? 'long-arrow-up' : 'long-arrow-down'" class="sorting"></icon>
              <v-icon v-if="vuetify" dark>arrow_upward</v-icon>
              {{ sortOrderNumber(col.name) }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(row, rowIndex) in filteredData"
          @click="setSelection(filteredData[rowIndex].id.value, $event)"
          :class="[selectedRowArray.indexOf(filteredData[rowIndex].id.value) >= 0 ? 'activeRow' : '']">
          <td v-for="(cell, key, index) in row"
            @click="setTarget(rowIndex, key)"
            :class="[cell.isActive ? 'activeCell' : '']"
            v-show="!cell.isHidden && cell.show"
            :data-th="key">
            <div class="cell-wrapper">
              <div v-show="!cell.isActive || !cell.isEditable" ref="span">{{ cell.value }}</div>
              <input
                type="text"
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

      <div id="pagination" v-if="opt.pagination.show">
        <div class="row">
          <label for="temsPerPage" v-if="customdark">Show: </label>
          <select class="itemsPerPageDropdown" v-model="opt.pagination.itemsPerPage" id="itemsPerPage" @change="resetCurrentPage()" v-if="customdark">
            <option v-for="option in opt.pagination.itemsPerPageValues" v-bind:value="option.value">
              {{ option.text }}
            </option>
          </select>
          <v-select
            style="width:70px"
            v-bind:items="opt.pagination.itemsPerPageValues"
            v-model="opt.pagination.itemsPerPage"
            @change.native="resetCurrentPage()"
            label="Show:"
            dark
            item-value="text"
            v-if="vuetify">
          </v-select>
        </div>
        <div class="row numbers">
          <a :class="[isStartPage ? 'vet-btn disabled' : 'vet-btn']" role="button" @click="showPrev" :disabled="isStartPage" v-if="customdark">&laquo;</a>
          <v-btn small dark default class="pagination-btn" @click.native="showPrev" :disabled="isStartPage" v-if="vuetify">
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <div v-for="pageNumber in totalPages">
            <a class="vet-btn disabled points" role="button" v-show="pageNumber == 2 && currentPage >= 3&& maxNumber >= 7" disabled v-if="customdark">...</a>
            <a :class="[currentPage == pageNumber - 1 ? 'vet-btn active' : 'vet-btn']"
              @click="setPage(pageNumber)"
              v-if="customdark && isInPaginationRange(pageNumber)"
              role="button">
              {{ pageNumber }}
            </a>
            <a class="vet-btn disabled points" role="button" v-show="pageNumber == maxNumber - 2 && currentPage <= maxNumber - 4 && maxNumber >= 7" disabled v-if="customdark">...</a>
            <v-btn small dark default class="pagination-btn" v-show="pageNumber == 2 && currentPage >= 3&& maxNumber >= 7" disabled v-if="vuetify">...</v-btn>
            <v-btn small dark default
              class="pagination-btn"
              :class="{ 'pagination-btn-active': currentPage == pageNumber - 1 }"
              @click.native="setPage(pageNumber)"
              v-if="vuetify && isInPaginationRange(pageNumber)">
              {{ pageNumber }}
            </v-btn>
            <v-btn small dark default class="pagination-btn" v-show="pageNumber == maxNumber - 2 && currentPage <= maxNumber - 4 && maxNumber >= 7" disabled v-if="vuetify">...</v-btn>
          </div>
          <a :class="[isEndPage ? 'vet-btn disabled' : 'vet-btn']" role="button" @click="showNext" :disabled="isEndPage" v-if="customdark">&raquo;</a>
          <v-btn small dark default class="pagination-btn" @click.native="showNext" :disabled="isEndPage" v-if="vuetify">
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </div>
      </div>

    </div>
  </div>
</template>

<script src="./editable.js"></script>
<style src="./editable.css"></style>

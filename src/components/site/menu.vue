<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Application
        </v-list-item-title>
        <v-list-item-subtitle>
          subtext
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list>
      <v-list-group
        v-for="(item, i) in items"
        :key="i"
        v-model="item.active"
        :prepend-icon="item.icon"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(subItem, j) in item.subItems"
          :key="j"
          :to="subItem.to"
        >
          <v-list-item-content>
            <v-list-item-title v-text="subItem.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
              <v-list-item-title>서브추가하기</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item @click="openDialogItem(-1)">
          <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
              <v-list-item-title>추가하기</v-list-item-title>
          </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-dialog v-model="dialogItem" max-width="400">
      <v-card>
        <v-card-title>
          수정하기
          <v-spacer></v-spacer>
          <v-btn icon><v-icon>mdi-content-save</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="formItem.title"></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ['items'],
  data () {
    return {
      dialogItem: false,
      dialogSubItem: false,
      formItem: {
        icon: '',
        title: ''
      }
    }
  },
  methods: {
    openDialogItem (index) {
      this.dialogItem = true
    }
  }
}
</script>

<template>
  <v-navigation-drawer v-model="show" temporary app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Enspire</v-list-item-title>
        <v-list-item-subtitle>Make CAS great again</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list nav dense>
      <v-list-item-group
        v-model="group"
        active-class="primary--text text--accent-4"
      >
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>首页</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div v-for="section in drawerItems" :key="section.title">
          <v-divider />
          <v-subheader>{{ section.title }}</v-subheader>
          <v-list-item
            v-for="item in section.items"
            :key="item.title"
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  watch: {
    group(): void {
      this.$emit("hide-sidebar");
    },
  },
  props: {
    drawer: Boolean,
  },
})
export default class Sidebar extends Vue {
  group = null;
  drawerItems = [
    {
      title: "CAS 管理",
      items: [
        { title: "我们的社团", icon: "mdi-view-dashboard", to: "/clubs" },
        { title: "预约教室", icon: "mdi-calendar", to: "/reservation" },
      ],
    },
    {
      title: "校园管理",
      items: [
        { title: "自修课请假", icon: "mdi-script-text", to: "/selfstudy" },
      ],
    },
    {
      title: "信息",
      items: [{ title: "关于我们", icon: "mdi-information", to: "/about" }],
    },
  ];
  get show(): boolean {
    return this.$props.drawer;
  }
  set show(newValue: boolean) {
    if (newValue === false) this.$emit("hide-sidebar");
  }
}
</script>

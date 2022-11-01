<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <!--Top bar-->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Enspire
          </v-list-item-title>
          <v-list-item-subtitle>
            Make CAS great again
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list dense nav>
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
          <v-divider />
          <v-subheader>CAS管理</v-subheader>
          <v-list-item
            v-for="item in drawerItems"
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
          <v-divider />
          <v-subheader>信息</v-subheader>
          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>关于我们</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <Login-dialog ref="loginDialog" @login-success="globalInit" />
      <v-btn fab outlined small @click="showLoginDialog">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import LoginDialog from '@/components/LoginDialog'

export default {
  name: 'DefaultLayout',
  components: {
    LoginDialog
  },
  data () {
    return {
      drawerItems: [
        { title: '我们的社团', icon: 'mdi-view-dashboard', to: '/clubs' },
        { title: '预约教室', icon: 'mdi-calendar', to: '/reservation' },
        {
          title: '申请请假',
          icon: 'mdi-checkbox-marked-outline',
          to: '/askforleave'
        }
      ],
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      title: 'Enspire'
    }
  },
  methods: {
    showLoginDialog () {
      this.$refs.loginDialog.show()
    },
    globalInit () {
      this.$store.dispatch('globalInit')
    }
  }
}
</script>
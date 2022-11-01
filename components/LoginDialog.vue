<template>
  <v-layout row justify-center>
    <v-dialog v-model="visible" persistent max-width="400">
      <v-card class="pa-4">
        <v-card-title>
          <span class="headline">登录</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="用户名/邮箱"
                  type="userName"
                  v-model="userName"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="密码"
                  type="password"
                  v-model="password"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary lighten-1" outlined @click="hide()">
            关闭
          </v-btn>
          <v-btn color="primary lighten-1" @click="tryLogin()">登录</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Axios from 'axios'
export default {
  name: 'LoginDialog',
  data () {
    return {
      visible: false,
      userName: '',
      password: ''
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    hide () {
      this.visible = false
    },
    tryLogin () {
      Axios.post('login.php', {
        username: this.userName,
        password: this.password
      }).then((response) => {
        if (response.data.success) {
          this.$emit('login-success')
        } else {
          this.$emit('login-fail', response.data.message)
        }
      })
    }
  }
}
</script>

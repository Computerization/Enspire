<template>
  <div class="about">
    <v-container>
      <v-row>
        <v-subheader>贡献者们</v-subheader>
      </v-row>
      <v-row>
        <v-col v-for="person in contributors" :key="person.alias">
          <v-card class="mx-auto" width="270" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">C社2020</div>
                <v-list-item-title class="headline mb-1">
                  {{ person.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ person.desc }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-avatar size="100">
                <img
                  :src="require(`@/assets/img/${person.alias}-avatar.jpg`)"
                  :alt="person.alias"
                />
              </v-list-item-avatar>
            </v-list-item>
            <v-card-actions class="white justify-center">
              <v-btn
                icon
                :href="`https://github.com/${person.alias}`"
                target="_blank"
                rel="noreferer"
              >
                <v-icon>mdi-link</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="mx-auto"
            width="270"
            color="rgba(0,128,255,0.1)"
            outlined
          >
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">社区贡献者</div>
                <v-list-item-title class="headline mb-1">
                  贡献者 X
                </v-list-item-title>
                <v-list-item-subtitle>会是你吗？</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-avatar size="100">
                <img
                  src="https://computerization.io/img/alumni/Default.svg"
                  alt="Contributor unknown"
                />
              </v-list-item-avatar>
            </v-list-item>
            <v-card-actions class="justify-center">
              <v-btn
                text
                href="https://github.com/computerization/enspire"
                target="_blank"
                rel="noreferer"
              >
                在 GitHub 上支持我们
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'about',
  data () {
    return {
      contributors: [
        {
          alias: 'Josh-Cena',
          name: '陈思达',
          desc: '22届Web负责人'
        },
        {
          alias: 'ETwilight',
          name: '郭培扬',
          desc: '22届副社长'
        },
        {
          alias: 'Lazenander',
          name: '杨淏然',
          desc: '23届打工人'
        },
        {
          alias: 'GeMini-220',
          name: '张驰',
          desc: '23届社员'
        },
        {
          alias: 'SamChou19815',
          name: '周天祎',
          desc: '17届社长'
        },
        {
          alias: 'mathscty',
          name: '陈韬宇',
          desc: '23届开发者'
        },
        {
          alias: 'KevJ12',
          name: '姜奕辰',
          desc: '23届社员'
        },
        {
          alias: 'yechs',
          name: '舒烨',
          desc: '20届社长'
        },
        {
          alias: 'JoyceQu',
          name: '曲乐成',
          desc: '22届美工'
        },
        {
          alias: 'edgexyz',
          name: '杨书',
          desc: '22届后端（伪）'
        },
        {
          alias: 'Will-WHT',
          name: '王昊天',
          desc: '22届社长'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>

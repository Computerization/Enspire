<template>
  <div class="about">
    <h1>关于 Enspire</h1>
    <h2>贡献者们</h2>
    <table>
      <tr v-for="index in tableFirst" :key="index">
        <td
          v-for="person in contributors.slice(index, index + 4)"
          :key="person.alias"
        >
          <a :href="'https://github.com/' + person.alias" target="_blank">
            <img
              :src="require('@/assets/img/' + person.alias + '-avatar.jpg')"
              :alt="person.alias"
              class="avatar"
            />
            <div class="caption">
              <span>
                {{ person.name }}
              </span>
            </div>
          </a>
        </td>
      </tr>
    </table>

    <a href="https://github.com/Computerization/enspire" target="_blank">
      在 GitHub 上支持 / 帮助我们！
    </a>
  </div>
</template>

<script>
export default {
  name: "about",
  data: () => ({
    contributors: [
      {
        alias: "Josh-Cena",
        name: "陈思达"
      },
      {
        alias: "yechs",
        name: "舒烨"
      },
      {
        alias: "JoyceQu",
        name: "曲乐成"
      },
      {
        alias: "Will-WHT",
        name: "王昊天"
      },
      {
        alias: "ETwilight",
        name: "郭培扬"
      }
    ]
  }),
  computed: {
    tableFirst: function() {
      let res = [];
      for (let i = 0; i < this.contributors.length; i += 4) {
        res.push(i);
      }
      return res;
    }
  }
};
</script>

<style scoped>
a {
  color: #42b983;
  text-decoration: none;
}
table {
  margin: 0 auto;
  margin-bottom: 50px;
}
td {
  padding: 10px;
}
.avatar {
  border: 1px solid #cccccc;
  border-radius: 50%;
  width: 150px;
  transition: all 0.4s;
}
.avatar:hover {
  transform: scale(1.04);
}
.caption {
  margin-top: 10px;
  font-size: 5;
  color: #2c3e50;
}
.caption:hover {
  color: #42b983;
  text-decoration: none;
}
</style>

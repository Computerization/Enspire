<template>
  <div class="about">
    <h1>关于 Enspire</h1>
    <h2>贡献者们</h2>
    <table>
      <tr>
        <td v-for="person in contributors" :key="person.alias">
          <a :href="'https://github.com/' + person.alias">
            <img :src="person.avatar" :alt="person.alias" class="avatar" />
            <div class="caption">
              <span>
                {{ person.name }}
              </span>
            </div>
          </a>
        </td>
      </tr>
    </table>

    <a href="https://github.com/Computerization/enspire">
      在 GitHub 上支持 / 帮助我们！
    </a>
  </div>
</template>

<script>
export default {
  name: "about",
  data: function() {
    return {
      contributors: [
        {
          alias: "Josh-Cena",
          avatar:
            "https://avatars2.githubusercontent.com/u/55398995?s=460&u=88dc0dcb0691877524dd8739db9fde7ed4fa9721&v=4",
          name: "陈思达"
        },
        {
          alias: "yechs",
          avatar:
            "https://avatars3.githubusercontent.com/u/49149993?s=460&u=46c251b43f25364dd085b5aa8ba736cd0d207ef2&v=4",
          name: "舒烨"
        }
      ]
    };
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
  border-radius: 50%;
  width: 200px;
}
.caption {
  margin-top: 10px;
  font-size: 5;
  color: #2c3e50;
}
</style>

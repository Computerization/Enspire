<template>
  <div>
    <div class="Frame">
      <!-- <img src="../assets/img/Demo.jpg" alt="demo">Image Here</img> -->
      <!-- <p class="hint">Image Here (Automatic fit)</p> -->
      <div class="parent_img_div">
        <v-img
          class="parent_img"
          src="../assets/img/test_img.jpg"
          height="550"
          width="1400"
        >
        </v-img>
        <div class="child_img_div">
          <v-img
            class="child_img"
            src="../assets/img/test_img.jpg"
            height="440"
            width="1120"
          >
          </v-img>
        </div>
      </div>
    </div>
    <div class="Info">
      <span id="font1"> 作品名称 </span>

      <span id="font2"> 作者姓名 </span>
      <br />

      <span id="font3">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </span>
    </div>
    <v-card flat class="mx-auto">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon @click="handleClick">
          <v-icon>{{ isUp ? "mdi-thumb-up" : "mdi-thumb-up-outline" }} </v-icon>
        </v-btn>
        <div class="support-num">
          {{ this.support }}
        </div>
      </v-card-actions>
      <v-form ref="form" v-model="valid">
        <div>写下你的评论！</div>
        <v-text-field v-model="email" label="E-mail"></v-text-field>

        <v-text-field
          v-model="comment"
          label="Comments on the artwork"
          required
        ></v-text-field>

        <v-btn :disabled="!valid" color="success" class="mr-4" @click="submit">
          Submit
        </v-btn>

        <v-btn color="error" class="mr-4" @click="reset"> Reset</v-btn>
      </v-form>
    </v-card>
    <v-row justify="center">
      <v-btn depressed color="white" @click.stop="dialog = true" x-large>
        策展人的话
      </v-btn>
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="footerheadline">
            策展人的话 —— 陶晟恺
          </v-card-title>
          <v-card-text class="footerwords">
            <div>
              距离这个企划被第一次在core群里提出，几乎已经过去了整整一年。而我也不曾想过，群里的一句「我们明年办个摄影展吧」，最终开花结果成为这样的一个活动。而今天，这样一个摄影展能以这样的形式展示给大家，我和全体策划人员都十分欣慰。
            </div>
            <div>
              举办这样一个摄影展的愿意十分简单：高中生拍的照片为什么不能被更多的人看到呢？摄影真的是一个专业性很强的艺术形式吗？我们想让高中生拍的照片也被更多的人看到，便有了这样一个摄影展。
            </div>
            <div>
              而「窗」这样的主题便寄托着我们的愿望：我们愿让这场展览成为观众了解高中生摄影的一扇窗，从中看出高中生是如何利用相机展现他们看到的世界的。「窗」本身就和摄影有千丝万缕的练习，相机何尝不是我们了解世界的一扇窗呢？
            </div>
            愿各位观展愉快，也不要忘记最后给我们写下你的感想哦!
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
 
<script>
export default {
  data: () => ({
    dialog: false,
    isUp: false,
    support: 0,
    valid: true,
    comment: "",
    email: "",
  }),

  methods: {
    submit() {
      console.log(this.$data.comment);
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    handleClick() {
      if (this.isUp == false) this.support = this.support + 1;
      else this.support = this.support - 1;
      this.isUp = !this.isUp;
    },
  },
};
</script>

<style>
.Info {
  margin-bottom: 20px;
  background-color: rgb(67, 67, 67);
  color: white;
  width: 100%;
}

#font1 {
  font-size: 7mm;
  width: 20%;
  /* float:left; */
}

#font2 {
  font-size: 5mm;
  width: 80%;
  /* float:left; */
}
/* by TRY */
#font3 {
  font-size: 4mm;
}

.hint {
  color: blue;
  font: bold;
  font-size: 100px;
  background-image: -webkit-linear-gradient(
    bottom,
    #03ff24,
    rgb(255, 0, 0),
    rgb(76, 0, 255)
  );
}
.footerwords {
  font-size: 18px;
}
.text-area {
  width: 55%;
  height: 100px;
  margin-top: 30px;
  border-top: 3px solid gainsboro;
  border-bottom: 3px solid gainsboro;
  border-left: 3px solid gainsboro;
  border-right: 3px solid gainsboro;
}
.text-area textarea {
  width: 500px;
  margin: 0.75rem 0;
  border: none;
  outline: none;
  padding-left: 1.125rem;
  height: 6.5rem;
}
.text-area textarea::-webkit-input-placeholder {
  color: #9e9e9e;
}
.BTN1 {
  border-top: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
  border-left: 1px solid gainsboro;
  border-right: 1px solid gainsboro;
}

.parent_img_div {
  position: relative;
  height: 550px;
  width: 1400px;
}
.child_img_div {
  position: absolute;
  height: 440px;
  width: 1120px;
  left: 50%;
  top: 50%;
  margin-left: -560px;
  margin-top: -220px;
}
.parent_img_div {
  position: relative;
  height: 550px;
  width: 1400px;
}
.child_img_div {
  position: absolute;
  height: 440px;
  width: 1120px;
  left: 50%;
  top: 50%;
  margin-left: -560px;
  margin-top: -220px;
}
.parent_img {
  filter: blur(15px);
}
.child_img {
  position: relative;
}
</style>
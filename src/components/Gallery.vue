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
    <!-- 改这里就好↑ -->

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

    <div class="text-area">
      <textarea v-model="textdata" placeholder="Comments on the artwork">
      </textarea>
    </div>

    <button class="BTN1" onclick="submit()">Submit</button>
  </div>
</template>
 
<script>
function submit() {
  var comment = this.textdata;
  return {
    comment,
  };
}

export default {
  submit,
};
</script>

<style>
.Frame {
  border-style: solid;
  border-color: rgb(67, 67, 67);
  border-width: 3px;
  height: fit-content;
  width: 100%;
}

.Info {
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
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
.parent_img {
  filter: blur(15px);
}
.child_img {
  position: relative;
}
</style>
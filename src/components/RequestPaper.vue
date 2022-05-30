<template>
  <!-- <div class="date" id="date">

  </div> -->
  <!-- 这里最后改一下 -->
  <div class="paper" id="app">
    <div class="date">
<<<<<<< HEAD
      <span>{{ date }}Date</span>
      <div>Year: {{ this.$route.query.year }}</div>
      <div>Month: {{ this.$route.query.month }}</div>
      <div>Day: {{ this.$route.query.day }}</div>
      <!-- 这里最后改一下 -->
    </div>
    <br />
=======
      <!-- <span>{{ date }}Date</span>
      <div>Year: {{ this.$route.query.year }}</div>
      <div>Month: {{ this.$route.query.month }}</div> -->
      <div> {{ this.$route.query.day }}</div>
      <!-- 这里最后改一下 -->
    </div>
    <br />
    <p>Select the period to leave:</p>
>>>>>>> 2e6353e (feat: Update ask to leave)
    <div class="selectbar">
      <select v-model="selected" multiple style="width: 150px; height: 100px">
        <option>Period 1</option>
        <option>Period 2</option>
        <option>Period 3</option>
        <option>Period 4</option>
        <option>Period 5</option>
        <option>Period 6</option>
        <option>Period 7</option>
        <option>Period 8</option>
        <option>Period 9</option>
      </select>
    </div>
    <br />

    <span style="float: left">Selected:{{ selected }}</span>
    <br />
    <div class="text-area">
      <textarea v-model="textdata" placeholder="Reasons To Leave"> </textarea>
    </div>
    <br />
    <button class="BTN1" onclick="submit()">Submit</button>
  </div>
</template>
 
<script>
// document.getElementById("demo").innerHTML="eee"

function submit() {
  var reason = this.textdata;
  return {
    reason,
  };
}

function sel() {
  return {
    selected: [],
  };
}

<<<<<<< HEAD
export default {
  submit,
  sel,
=======
function datee(){
  return {
    date
  }
}

export default {
  submit,
  sel,
  datee,
  name:"app",
  data(){
    return{
      selected:[]
    }
  }
>>>>>>> 2e6353e (feat: Update ask to leave)
};

//export {selected};
import { date } from "../components/Calendar.vue";

<<<<<<< HEAD
=======
//yts
>>>>>>> 2e6353e (feat: Update ask to leave)
//gqy 这里是把你的日历上的日期传过来，你可能需要在文件里export一下日期
//我不是很敢直接改你代码，所以可能还是要你来写一下export，然后把这里的文件名对上
//最后改一下第9行即可

// import headers from '../components/headers.vue'
// import MuContainer from "muse-ui/src/Grid/Container";
// export function{
//   name: "assignPointsDirectly",
//   data(){
//     return {}
//   },
//   components: {
//     MuContainer,
//     headers
//   }
// }

// import date{
//   name:'date',
//   data(){
//     return{

//     }
//   }
// }
</script>

<style>
.paper {
  margin-left: 75px;
  width: 75%;
  float: left;
}

.date {
  height: 60px;
  width: 60px;
  border-top: 5px solid gainsboro;
  border-bottom: 5px solid gainsboro;
  border-left: 5px solid gainsboro;
  border-right: 5px solid gainsboro;
<<<<<<< HEAD
  align-items: center;
}

.selectbar {
  height: 100px;
  width: 160px;
  border-top: 5px solid grey;
  border-bottom: 5px solid grey;
  border-left: 5px solid grey;
  border-right: 5px solid grey;
=======
  text-align:  center;
  font-size: 35px;
}

.selectbar {
  height: 110px;
  width: 160px;
  border-top: 5px solid gainsboro;
  border-bottom: 5px solid gainsboro;
  border-left: 5px solid gainsboro;
  border-right: 5px solid gainsboro;
>>>>>>> 2e6353e (feat: Update ask to leave)
}

.text-area {
  width: 70%;
  margin-top: 30px;
<<<<<<< HEAD
  border-top: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
  border-left: 1px solid gainsboro;
  border-right: 1px solid gainsboro;
=======
  border-top: 3px solid gainsboro;
  border-bottom: 3px solid gainsboro;
  border-left: 3px solid gainsboro;
  border-right: 3px solid gainsboro;
>>>>>>> 2e6353e (feat: Update ask to leave)
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
</style>
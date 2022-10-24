<template>
  <!-- <div class="date" id="date">

  </div> -->
  <!-- 这里最后改一下 -->
  <div class="paper" id="app">
    <div class="date">
      <!-- <span>{{ date }}Date</span>
      <div>Year: {{ this.$route.query.year }}</div>
      <div>Month: {{ this.$route.query.month }}</div> -->

      <div>{{ this.$route.query.day }}</div>
      <!-- 这里最后改一下 -->
    </div>
    <br />
    <p>Select the period(s) to leave:</p>

    <v-container fluid>
      <v-select
        v-model="selected"
        :items="items"
        chips
        label="Select Period(s)"
        multiple
        outlined
      ></v-select>
    </v-container>

    <div class="text-area">
      <v-textarea
        clearable
        clear-icon="mdi-close-circle"
        counter
        outlined
        v-model="textdata"
        placeholder="Reasons To Leave"
        label="Reasons To Leave"
      ></v-textarea>
    </div>
    <br />
    <v-btn
      depressed
      color="primary"
      v-on:click="submit()"
    >
      Submit
    </v-btn>
  </div>
</template>

<script>


function sel() {
  return {
    selected: [],
  };
}

function datee() {
  return {
    date,
  };
}

export default {
  sel,
  datee,
  name: "app",
  data: () => ({
    selected: [],
    items: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8', 'Period 9'],
    value: [],
    textdata: "",
  }),
  methods: {
    submit() {
      const reason = this.textdata;
      return {
        reason,
      };
    },

  },
};

//export {selected};
import { date } from "../components/Calendar.vue";

//yts
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
/*.paper {
  margin-left: 75px;
  width: 75%;
  float: left;
}*/

.date {
  height: 60px;
  width: 60px;
  border-top: 5px solid gainsboro;
  border-bottom: 5px solid gainsboro;
  border-left: 5px solid gainsboro;
  border-right: 5px solid gainsboro;
  text-align: center;
  font-size: 35px;
}

/*.selectbar {
  height: 110px;
  width: 160px;
  border-top: 5px solid gainsboro;
  border-bottom: 5px solid gainsboro;
  border-left: 5px solid gainsboro;
  border-right: 5px solid gainsboro;
}*/

/*.text-area {
  width: 70%;
  margin-top: 30px;
  border-top: 3px solid gainsboro;
  border-bottom: 3px solid gainsboro;
  border-left: 3px solid gainsboro;
  border-right: 3px solid gainsboro;
}*/
/*.text-area textarea {
  width: 500px;
  margin: 0.75rem 0;
  border: none;
  outline: none;
  padding-left: 1.125rem;
  height: 6.5rem;
}*/
/*.text-area textarea::-webkit-input-placeholder {
  color: #9e9e9e;
}*/
.BTN1 {
  border-top: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
  border-left: 1px solid gainsboro;
  border-right: 1px solid gainsboro;
}
</style>

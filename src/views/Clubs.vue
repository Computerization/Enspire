<template>
  <div class="album">
    <v-container>
      <v-row>
        <v-col v-for="item in clubs" :key="item.name" align="center">
          <v-card width="370" align="left">
            <v-img :src="item.cover" height="200" />
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-text>
              <div>{{ item.desc.substring(0, 90) }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    clubs: [
      {
        name: "世外信息化社",
        logo: "Computerization-logo.svg",
        cover: "https://cdn.vuetifyjs.com/images/cards/cooking.png",
        desc:
          "我们的全称是信息化社，不过我们更喜欢被称之为C社（Computerization）；我们开发并维护了校内信息化平台 Enspire；我们是一个长期在幕后工作的，以面向社团的知识性服务为主的，一个小而精的CS社团；我们认为，代码仅仅是算法的形式载体，是 Computer Scientists 的思想和 Algorithms 造就了他/她们，而不是代码本身；因此，我们有着程序设计交流的社团文化； 此外，我们与各学生组织都有着深入的合作。我们与数学社合作，开办了面向十年级的数学建模课程；我们与 Techomedia 合作，为 Techomedia 的推文和大型活动提供技术支持；我们与学生会合作，提供社团活动教室预约平台、五星社团/新社团/末位社团答辩评分平台；我们与慈善晚会 Charity 合作，为他们提供拍卖的线上实时出价与竞价平台；……"
      },
      {
        name: "WFLA 数学社",
        logo: "Computerization-logo.svg",
        cover: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
        desc:
          "社团活动主要为建模，竞赛培训为主。其中间或会穿插着数学趣味知识补充、推文撰写，以及高数交流。重点针对比赛 AMC 以及 HiMCM、IMMC，让同学们在建模以及数学竞赛上有所收获，有所斩获。"
      },
      {
        name: "世外英语辩论社",
        logo: "Computerization-logo.svg",
        cover: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
        desc:
          "世外英语辩论社的宗旨是“持续不断地为世外培养辩论方面的人才”；在打好每一场辩论赛的同时，不只是带领好下一届，更是要将辩论的技巧和热忱传递给后继的世外学子。我们的社团不仅会利用平日活动来锻炼社员们的能力，还会提供市级，全国级以及全美辩论比赛供社员们自行选择。我们的社团活动会涵盖但不局限于下列内容：辩题的、即兴演讲、研究的方式方法，辩论稿的整理修改，公开论坛的练习，交战的练习和导师点评。通过这些活动，社员们锻炼了公共演讲能力，锻炼了议题分析能力和思维辩证能力，提高了解决问题的效率，培养了对于辩论的兴趣，更在一次次比赛中积累了经验，得到了成长。然而真正给大家带来变化的其实更多的是自信心的增强：辩论要求我们自信地将自己的想法展现给他人，要求我们有随机应变的能力。我们的社团不仅仅是关于英语辩论，更是一种态度，一种持之以恒的态度，一种展现自我的态度，一个思考者的态度。我们会培养出一批真正热爱辩论的人，并将这份热情传递给每一届世外人。"
      },
      {
        name: "拓科传媒",
        logo: "Computerization-logo.svg",
        cover: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
        desc:
          "STEM 圈氛围浓厚，却似乎像一个围城，城里的技术宅们各司其职，城外的小白们望眼欲穿，却又望尘莫及。于是，techo的初创团队针对这一现状，在五年前，创建了 Techomedia 拓科传媒。在过去，Techomedia 发布380余篇科技推文，总阅读量逾38万；我们也出席各类展会和宣讲会10余次，协办5场大型科技赛事；未来，Techomedia 将不受限于从前，一如既往地跳出舒适区，发起更具多元化和包容性的 STEM 活动，扩大组织的全国影响力；同时 Techo 希望与更多的学生科技社团、学生组织、社会科技企业、民非组织展开合作，组织更具影响力的科技活动，给更多的中国青年带去科技的乐趣，让每一个创新的想法，都能得到不容小觑的力量。"
      }
    ]
  })
};
</script>

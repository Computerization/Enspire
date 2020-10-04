<template>
  <div class="album">
    <v-row class="align-center">
      <v-col v-for="item in clubs" :key="item.name" class="col-4">
        <v-card>
          <v-carousel v-model="item.num" height="300">
            <v-carousel-item v-for="(color, i) in item.colors" :key="color">
              <v-sheet :color="color" height="100%" tile>
                <v-row class="fill-height" align="center" justify="center">
                  <div class="display-3">Slide {{ i + 1 }}</div>
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
          <v-list two-line>
            <v-list-item>
              <v-list-item-avatar>
                <v-img :src="require('@/assets/img/' + item.logo)" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action></v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    clubs: [
      {
        name: "信息化社",
        logo: "Computerization-logo.svg",
        num: 0,
        colors: ["primary", "secondary", "yellow darken-2", "red", "orange"]
      }
    ]
  })
};
</script>

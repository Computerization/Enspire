<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>社团总览</h2>
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="搜索名称"
          v-model="searchText"
          @keyup="search"
          outlined
          dense
        />
      </v-col>
    </v-row>
    <template v-if="dataLoaded && searchText.trim() !== ''">
      <v-row>
        <v-container fluid>
          <v-row>
            <Club-card v-for="item in resultList" :key="item.id" :club="item"/>
          </v-row>
        </v-container>
      </v-row>
    </template>
    <template v-else-if="dataLoaded">
      <v-row v-for="(category, index) in categories" :key="index">
        <v-subheader class="sectionHead" @click="toggleSection(index)">
          <v-icon>
            {{ categories[index].visible ? 'mdi-menu-down' : 'mdi-menu-right' }}
          </v-icon>
          {{ category.name }}
        </v-subheader>
        <v-container v-if="categories[index].visible" fluid>
          <v-row>
            <Club-card
              v-for="item in category.clubs"
              :key="item.id"
              :club="item"
            />
          </v-row>
        </v-container>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <p>Loading...</p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import Axios from 'axios'
import { pinyin } from 'pinyin-pro'
import ClubCard from '../components/ClubCard.vue'
import { encode } from '~/utils/urlTransform'

export default {
  components: {
    ClubCard
  },
  data () {
    return {
      categories: [
        {
          name: '体育类社团',
          visible: false,
          clubs: []
        },
        {
          name: '服务类社团',
          visible: true,
          clubs: []
        },
        {
          name: '艺术类社团',
          visible: false,
          clubs: []
        },
        {
          name: '生活类社团',
          visible: false,
          clubs: []
        },
        {
          name: '学术类社团',
          visible: false,
          clubs: []
        },
        {
          name: '其他',
          visible: false,
          clubs: []
        }
      ],
      dataLoaded: false,
      searchText: '',
      resultList: [],
      clubList: [],
      encode
    }
  },

  methods: {
    toggleSection (index) {
      this.categories = this.categories.map((e, i) =>
        i === index
          ? {
              ...e,
              visible: !e.visible
            }
          : e
      )
    },
    search () {
      this.resultList = this.clubList.filter((item) => {
        return item.name.includes(this.searchText)
      })
    },
    async getClubList () {
      const res = await Axios.get('/api/club/list')
      this.clubList = res.data
      this.clubList.forEach((item) => {
        item.pinyin = pinyin(item.name, {
          style: pinyin.STYLE_NORMAL,
          heteronym: true
        })
        item.pinyin = item.pinyin.join(' ')
      })
      this.clubList.sort((a, b) => {
        return a.pinyin.localeCompare(b.pinyin)
      })
      this.clubList.forEach((item) => {
        if (item.category === '体育类社团') {
          this.categories[0].clubs.push(item)
        } else if (item.category === '服务类社团') {
          this.categories[1].clubs.push(item)
        } else if (item.category === '艺术类社团') {
          this.categories[2].clubs.push(item)
        } else if (item.category === '生活类社团') {
          this.categories[3].clubs.push(item)
        } else if (item.category === '学术类社团') {
          this.categories[4].clubs.push(item)
        } else {
          this.categories[5].clubs.push(item)
        }
      })
      this.dataLoaded = true
    }
  }

}

</script>

<style scoped>
.sectionHead {
  cursor: pointer;
}
</style>

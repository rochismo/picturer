<template>
  <div class="row justify-center">
    <div class="fit q-pa-lg flex flex-center">
      <q-pagination
        v-model="page"
        :min="currentPage"
        :max="totalPages"
        :input="true"
      >
      </q-pagination>
    </div>
    <ImageComponent
      v-for="image in imageData"
      :key="image.id"
      :imageData="image"
      class="fit q-ma-lg"
    />
    <div class="fit q-pa-lg flex flex-center">
      <q-pagination
        v-model="page"
        :min="currentPage"
        :max="totalPages"
        :input="true"
      >
      </q-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import { ImageData } from "./../ImagesContainer.vue";
import ImageComponent from "./Image/ImageView.vue";
import { paginate } from "components/utils";
@Component({
  computed: {
    ...mapState("links", ["images", "showFavorites"])
  },
  components: { ImageComponent }
})
export default class ImageList extends Vue {
  images!: ImageData[];
  showFavorites!: boolean;
  page = 1;
  currentPage = 1;

  get maxItems() {
    const screen = this.$q.screen;
    return screen.lt.md ? 2 : 8;
  }

  get pagination() {
    return paginate(this.images, this.page, this.maxItems);
  }

  get totalPages() {
    return this.pagination.total_pages;
  }

  get imageData() {
    return this.showFavorites ? this.pagination.data.filter(i => i.favorite) : this.pagination.data;
  }
}
</script>

<style></style>

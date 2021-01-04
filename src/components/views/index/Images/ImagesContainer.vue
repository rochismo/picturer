<template>
  <div class="flex justify-center">
    <h4 v-if="!images.length">
      There are no images
    </h4>
    <ImageList v-if="images.length" class="fit" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import ImageList from "./ImageList/ImageList.vue";

export interface ImageData {
  url: string;
  base64Url: string;
  favorite: boolean;
  id: number;
  domain: string;
}


@Component({
  computed: {
    ...mapState("links", ["images"])
  },
  components: { ImageList }
})
export default class ImagesContainer extends Vue {
    images!: ImageData[];
}
</script>

<style></style>

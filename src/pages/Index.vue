<template>
  <q-page padding class="flex items-center column">
    <TopBar class="fit" />
    <ImagesContainer class="fit" />
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";

import TopBar from "components/views/index/TopBar.vue";
import ImagesContainer from "components/views/index/images/ImagesContainer.vue";


@Component({
  components: { TopBar, ImagesContainer }
})
export default class PageIndex extends Vue {}
</script>

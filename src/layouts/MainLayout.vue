<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <Bar />
      <AppMenu />
    </q-header>

    <q-scroll-area class="fit" style="width: 100% !important; height: 100vh !important;">
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-scroll-area>
  </q-layout>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Bar from "components/layout/Bar.vue";
import AppMenu from "components/layout/AppMenu.vue";
@Component({
  components: { Bar, AppMenu }
})
export default class MainLayout extends Vue {
  constructor() {
    super();
    const darkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
    this.$q.dark.set(darkMode);
    this.$q.electron.ipcRenderer.on("all-images", this.setImages);
    this.getImages();
  }

  getImages() {
    this.$q.electron.ipcRenderer.send("get-images");
  }

  setImages(_: any, images: any[]) {
    this.$store.commit("links/setImages", images);
  }
}
</script>

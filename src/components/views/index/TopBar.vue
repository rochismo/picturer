<template>
  <div class="flex items-center">
    <q-input
      v-model="imageUrl"
      label="Image Link"
      filled
      class="fit"
      hint="You can also press enter to add the image"
      ref="imageInput"
      :error="hadError"
      :error-message="errorMessage"
      @keypress.enter="addImage"
      :loading="addingImage"
    >
      <template v-slot:after>
        <q-btn round color="primary" icon="add" @click.stop="addImage"></q-btn>
      </template>
      <template v-slot:loading>
        <q-spinner color="warning" style="font-size: 2rem"></q-spinner>
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import * as url from "url";
import { ErrorData, Existing, ImageData } from "./typings";

@Component({
  computed: {
    ...mapState("links", ["showFavorites"])
  }
})
export default class TopBar extends Vue {
  imageUrl: string = "";
  addingImage: boolean = false;
  errorMessage: string = "";
  hadError: boolean = false;
  showFavorites!: boolean;

  constructor() {
    super();
    this.$q.electron.ipcRenderer.on("image-added", this.onImageAdded);
  }

  _setError(message: string) {
    this.hadError = true;
    this.errorMessage = message;
  }

  onImageAdded(_: any, data: any) {
    this.addingImage = false;
    if (data.hadError) {
      return this._setError(data.message);
    }
    if (data.exists) {
      return this._setError("Image already exists");
    }

    this.$store.commit("links/addImage", data);
    const message = this.showFavorites
      ? "Image was added but not displayed because you're showing favourited images"
      : "Image added successfully";
    this.$q.notify({
      message,
      progress: true,
      icon: "add",
      position: "top",
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {
            /* ... */
          }
        }
      ]
    });
  }

  getInput() {
    return this.$refs.imageInput;
  }
  addImage() {
    this.hadError = false;

    this.addingImage = true;

    this.$q.electron.ipcRenderer.send("add-image", this.imageUrl);
  }
}
</script>

<style></style>

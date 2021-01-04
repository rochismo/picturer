<template>
  <q-card class="image col-3">
    <q-card-section horizontal>
      <q-img
        class="col q-mx-md"
        :src="`data:image/png;base64,${displayImage.base64Url}`"
        img-class="avatar-img"
      >
        <div class="absolute-bottom text-center text-h6">
          {{ displayImage.domain }}
        </div>
      </q-img>
      <q-separator vertical></q-separator>
      <q-card-actions vertical class="justify-around q-px-md">
        <q-btn
          flat
          round
          class="icon-btn"
          :icon="displayImage.favorite ? 'star' : 'star_border'"
          color="orange"
          @click="setFavorite"
        >
          <q-tooltip content-style="font-size: 1rem">
            {{ displayImage.favorite ? "Unfavorite" : "Set favorite" }}
          </q-tooltip>
        </q-btn>
        <q-btn
          flat
          class="icon-btn"
          round
          color="primary"
          :icon="editMode ? 'close' : 'edit'"
          @click="toggleEditMode"
        >
          <q-tooltip content-style="font-size: 1rem" class="icon-btn">
            Edit Link
          </q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          color="negative"
          icon="delete"
          class="icon-btn"
          @click="openDeleteDialog"
        >
          <q-tooltip content-style="font-size: 1rem">
            Delete image
          </q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          color="accent"
          icon="content_copy"
          @click="copyToClipboard"
        >
          <q-tooltip content-style="font-size: 1rem">Copy image url</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card-section>

    <q-slide-transition>
      <div v-show="editMode">
        <q-separator />
        <q-card-section class="text-subitle2">
          <q-input
            v-model="displayImage.url"
            :error="hadError"
            :error-message="errorMessage"
            @keypress.enter="openUpdateDialog"
            :loading="updatingImage"
          >
            <template v-slot:after>
              <q-btn
                round
                color="primary"
                icon="save"
                @click="openUpdateDialog"
              />
            </template>
          </q-input>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ErrorData, ImageData } from "../../../typings";

@Component({
  name: "ImageView",
  beforeDestroy() {
    this.$q.electron.ipcRenderer.off(
      `updated-${this.imageData.id}`,
      this.onUpdatedImage
    );
  }
})
export default class ImageComponent extends Vue {
  @Prop({ required: true }) readonly imageData!: ImageData;
  displayImage: ImageData;
  imageCopy: ImageData;
  editMode: boolean = false;
  hadError: boolean = false;
  errorMessage: string = "";
  updatingImage: boolean = false;

  constructor() {
    super();
    this.displayImage = { ...this.imageData };
    this.imageCopy = { ...this.imageData };
    this.$q.electron.ipcRenderer.on(
      `updated-${this.displayImage.id}`,
      this.onUpdatedImage
    );
  }

  _setError(message: string) {
    this.hadError = true;
    this.errorMessage = message;
  }

  onUpdatedImage(_: any, data: ImageData | any ) {
    this.updatingImage = false;
    if (data.hadError) {
      return this._setError(data.message);
    }

    if (data.exists) {
      return this._setError("Image already exists")
    }
    this.editMode = false;
    this.displayImage = data;
    this.imageCopy = { ...this.displayImage };
    this.$store.commit("links/updateImage", this.displayImage);
    this.sendNotification("Image updated successfully", "edit")
  }

  setFavorite() {
    this.displayImage.favorite = !this.displayImage.favorite;
    this.$store.commit("links/updateImage", this.displayImage);
    this.$q.electron.ipcRenderer.send("set-favorite", this.displayImage)
  }

  toggleEditMode() {
    if (!this.editMode) {
      return (this.editMode = true);
    }
    if (!this.hasChanged()) {
      return (this.editMode = false);
    }
    this.$q
      .dialog({
        message:
          "There are unsaved changes, are you sure you want to undo them?",
        title: "Unsaved changes",
        cancel: true
      })
      .onOk(() => {
        this.displayImage = { ...this.imageCopy };
        this.editMode = false;
      });
  }

  copyToClipboard() {
    const dummy = document.createElement("textarea");
    dummy.style.position = "absolute";
    dummy.style.top = "-99999px";
    dummy.value = this.displayImage.url;
    document.body.appendChild(dummy);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.sendNotification("Copied to clipboard!", "content_copy");
  }

  sendNotification(message: string, icon: string) {
    this.$q.notify({
      progress: true,
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
      ],
      icon,
      message
    });
  }

  openUpdateDialog() {
    if (!this.hasChanged()) {
      return this.toggleEditMode();
    }
    this.$q
      .dialog({
        title: "Changes detected",
        message: "Are you sure you want to save the current changes?",
        cancel: true
      })
      .onOk(() => {
        this.$q.electron.ipcRenderer.send("update-image", this.displayImage);
      });
  }

  hasChanged() {
    return this.displayImage.url !== this.imageCopy.url;
  }

  openDeleteDialog() {
    this.$q
      .dialog({
        title: "Image deletion",
        message: "Are you sure you want to delete this image?",
        cancel: true
      })
      .onOk(() => {
        this.$q.electron.ipcRenderer.send("delete-image", this.imageData.id);
        this.$store.commit("links/removeImage", this.imageData.id);
        this.sendNotification("Image deleted successfully", "delete");
      });
  }
}
</script>

<style scoped>
.image {
  width: 500px !important;
  max-height: 600px !important;
}

.icon-btn {
  font-size: 1.2rem;
}

.avatar-img {
  height: 300px !important;
}
</style>

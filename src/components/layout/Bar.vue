<template>
  <q-bar class="q-electron-drag">
    <q-icon name="camera_alt" color="white" />
    <div>ᴘɪᴄᴛᴜʀᴇʀ</div>
    
    <q-space />

    <q-btn dense flat icon="minimize" @click="minimize" />
    <q-btn dense flat icon="crop_square" @click="maximize" />
    <q-btn dense flat icon="close" @click="closeApp" />
  </q-bar>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "Bar"
})
export default class Bar extends Vue {
  mode = process.env.MODE;
  isElectron = this.mode === "electron";

  getFocusedWindow() {
    return this.$q.electron.remote.BrowserWindow.getFocusedWindow();
  }

  minimize() {
    if (this.isElectron) {
      const win = this.getFocusedWindow();
      if (!win) {
        return;
      }
      win.minimize();
    }
  }

  maximize() {
    if (this.isElectron) {
      const win = this.getFocusedWindow();

      if (!win) {
        return;
      }
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  }

  closeApp() {
    if (this.isElectron) {
      const win = this.getFocusedWindow();
      if (!win) {
        return;
      }
      win.close();
      win.destroy();
    }
  }
}
</script>

<style lang="scss" scoped></style>

<template>
  <div class="q-pa-sm q-pl-md row items-center">
    <div class="cursor-pointer non-selectable">
      Settings
      <q-menu>
        <q-list dense style="min-width: 100px">
          <q-item clickable @click="toggleDarkMode(false)">
            <q-item-section>Dark Mode</q-item-section>
            <q-item-section avatar>
              <q-checkbox
                v-model="darkMode"
                @click.stop
                @input="toggleDarkMode(true)"
              ></q-checkbox>
            </q-item-section>
          </q-item>
          <q-item clickable @click="toggleFavorites(false)">
            <q-item-section>Show favorites only</q-item-section>
            <q-item-section avatar>
              <q-checkbox
                v-model="showFavorites"
                @click.stop
                @input="toggleFavorites(true)"
              ></q-checkbox>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
@Component({})
export default class AppMenu extends Vue {
  darkMode: boolean;
  showFavorites: boolean;

  constructor() {
    super();
    const prevDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "false"
    );
    const prevFavorites = JSON.parse(localStorage.getItem("favorites") || "false");
    this.showFavorites = prevFavorites;
    this.darkMode = prevDarkMode;
  }

  toggleDarkMode(fromInput = false) {
    if (!fromInput) {
      this.darkMode = !this.darkMode;
    }
    this.$q.dark.set(this.darkMode);
    localStorage.setItem("darkMode", JSON.stringify(this.darkMode));
  }
  toggleFavorites(fromInput = false) {
    if (!fromInput) {
      this.showFavorites = !this.showFavorites;
    }
    this.$store.commit("links/toggleFavorites", this.showFavorites);
    localStorage.setItem("favorites", JSON.stringify(this.showFavorites));
  }
}
</script>

<style></style>

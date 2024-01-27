<template>
  <q-item clickable tag="a" :to="link">
    <q-item-section v-if="icon" avatar>
      <q-icon color="primary" :name="icon" v-if="icon !== 'person'" />
      <q-avatar size="sm" v-else-if="user.user_metadata.avatar_url">
        <img :src="user.user_metadata.avatar_url" />
      </q-avatar>
      <q-icon color="primary" v-else :name="icon" v-if="icon !== 'person'" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="uppercase font-bold text-primary">{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { useAuth } from "src/stores/auth";
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
    user: {
      type: Object,
      default: {},
    },
  },
});
</script>

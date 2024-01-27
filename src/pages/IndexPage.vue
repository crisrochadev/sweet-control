<template>
  <form class="form-widget" @submit.prevent="updateProfile" v-if="auth.session">
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="auth.session.user.email" disabled />
    </div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" v-model="username" />
    </div>
    <div>
      <label for="website">Website</label>
      <input id="website" type="url" v-model="website" />
    </div>

    <div>
      <input
        type="submit"
        class="button primary block"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">
        Sign Out
      </button>
    </div>
  </form>
</template>
<script>
import {supabase} from "src/boot/supabase";
import { useAuth } from "src/stores/auth";

export default {
  data() {
    const auth = useAuth();
    return {
      auth,
      loading: true,
      username: null,
      website: null,
      avatar_url: null,
    };
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    async getProfile() {
      console.log(this.auth.session)
      try {
        this.loading = true;
        const { user } = this.auth.session;

        const { data, error, status } = await this.$supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          this.username = data.username;
          this.website = data.website;
          this.avatar_url = data.avatar_url;
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        this.loading = false;
      }
    },
    async updateProfile() {
      try {
        this.loading = true;
        const { user } = this.auth.session;

        const updates = {
          id: user.id,
          username: this.username,
          website: this.website,
          avatar_url: this.avatar_url,
          updated_at: new Date(),
        };

        const { error } = await supabase.from("profiles").upsert(updates);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    },
    async signOut() {
      try {
        this.loading = true;
        const { error } = await this.$supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

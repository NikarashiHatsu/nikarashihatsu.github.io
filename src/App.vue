<template>
  <div>
    <Navbar />
    <ThemeToggler />
    <div class="max-w-7xl mx-auto p-6">
      <div class="grid grid-cols-12 grid-flow-row gap-6">
        <div class="col-span-9">
          <router-view />
        </div>
        <div class="col-span-3">
          <Profile />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from './components/Navbar.vue'
  import Profile from './components/Profile.vue'
  import ThemeToggler from './components/ThemeToggler.vue'

  export default {
    name: 'App',
    components: {
      Navbar,
      Profile,
      ThemeToggler,
    }
  }
</script>
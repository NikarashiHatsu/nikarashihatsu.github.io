<template>
  <div>
    <Navbar />
    <ThemeToggler />
    <router-view />
  </div>
</template>

<script>
  import ThemeToggler from './components/ThemeToggler.vue'
  import Navbar from './components/Navbar.vue'

  export default {
    name: 'App',
    components: {
      ThemeToggler,
      Navbar
    }
  }
</script>
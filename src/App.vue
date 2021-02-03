<template>
  <div>
    <div v-if="!isWorksPath">
      <Navbar />
      <div class="max-w-7xl mx-auto p-6">
        <div class="grid grid-cols-12 grid-flow-row gap-6">
          <div class="col-span-12 md:col-span-8 lg:col-span-9">
            <router-view></router-view>
          </div>
          <div class="col-span-12 md:col-span-4 lg:col-span-3">
            <Profile />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <WorksNavbar />
      <router-view></router-view>
    </div>
    
    <ThemeToggler />
  </div>
</template>

<script>
  import router from './router'
  import Navbar from './components/Navbar.vue'
  import Profile from './components/Profile.vue'
  import ThemeToggler from './components/ThemeToggler.vue'
  import WorksNavbar from './components/WorksNavbar.vue'

  export default {
    name: 'App',
    components: {
      Navbar,
      Profile,
      ThemeToggler,
      WorksNavbar,
    },
    computed: {
      isWorksPath() {
        let path = router.currentRoute.value.path
        
        if (path === '/' || path === '/works' || path.match('/notes/')) {
          return false
        }

        return true
      }
    }
  }
</script>
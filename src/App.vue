<template>
  <div id="app">
    <div id="nav">
      <img
        alt="Enspire logo"
        class="logo"
        src="@/assets/img/Enspire-logo.svg"
        width="60px"
      />
      <div class="links">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  background-color: #43b0f0;
  width: 100%;
  margin-left: -10px;
  margin-top: -10px;
}
.links {
  position: relative;
  right: 500px;
}
#nav a {
  font-weight: bold;
  text-decoration: none;
  color: #ffffff;
  margin-right: 50px;
}
#nav a.router-link-exact-active {
  color: #002060;
}

.logo {
  border-radius: 20%;
  position: absolute;
  left: 30px;
  top: 10px;
  background-color: white;
}
</style>

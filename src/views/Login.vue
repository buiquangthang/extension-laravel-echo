<template>
  <div>
    <h1>Login Page</h1>
    <div>
      <input type="text" placeholder="email">
    </div>
    <br>
    <div>
      <input type="password">
    </div>
    <br>
    <button type="submit">Login</button>

    <br>
    <br>

    <p>
      <router-link to="/">Home</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'login'
}
</script>

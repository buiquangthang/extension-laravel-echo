<template>
  <div class="container">

    <div class="card o-hidden border-0 shadow-lg my-5">
      <div class="card-body p-0">
        <!-- Nested Row within Card Body -->
        <div class="row">
          <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
          <div class="col-lg-7">
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
              </div>
              <form class="user" @submit.prevent="handleSubmit">
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input type="text" v-model="user.firstName" name="firstName" placeholder="First Name"
                      class="form-control form-control-user"/>
                  </div>
                  <div class="col-sm-6">
                    <input type="text" v-model="user.lastName"  name="lastName" placeholder="Last Name"
                      class="form-control form-control-user"/>
                  </div>
                </div>
                <div class="form-group">
                  <input type="text" v-model="user.username" name="username" placeholder="Email Address"
                    class="form-control form-control-user"/>
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input type="password" v-model="user.password" name="password" placeholder="Password"
                      class="form-control form-control-user"/>
                  </div>
                  <div class="col-sm-6">
                    <input type="password" class="form-control form-control-user" id="exampleRepeatPassword" placeholder="Repeat Password">
                  </div>
                </div>
                <button class="btn btn-primary btn-user btn-block">
                  Register Account
                </button>
                <hr>
                <a href="index.html" class="btn btn-google btn-user btn-block">
                  <i class="fab fa-google fa-fw"></i> Register with Google
                </a>
                <a href="index.html" class="btn btn-facebook btn-user btn-block">
                  <i class="fab fa-facebook-f fa-fw"></i> Register with Facebook
                </a>
              </form>
              <hr>
              <div class="text-center">
                <router-link to="forgot-password" class="small">Forgot Password?</router-link>
              </div>
              <div class="text-center">
                <router-link to="login" class="small">Already have an account? Login!</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: 'Reigster',
    data () {
        return {
            user: {
                firstName: '',
                lastName: '',
                username: '',
                password: ''
            },
            submitted: false
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    methods: {
        ...mapActions('account', ['register']),
        handleSubmit(e) {
            this.submitted = true;
            // this.$validator.validate().then(valid => {
                // if (valid) {
                    this.register(this.user);
                // }
            // });
        }
    }
};
</script>

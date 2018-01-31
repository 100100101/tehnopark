<template>
  <div :class="classes.rootViewSpace">
    <div class="root-view-space__content">
      <div
        v-show="isShowSuccsess"
        class=""
      >
        reception 'sign in' succsess: {<br>
          &nbsp;&nbsp;emeil: {{emailValue}},<br>
          &nbsp;&nbsp;password: {{passValue}},<br>
          &nbsp;&nbsp;isUserRemember: {{isUserRemember}},<br>
        }
      </div>
      <transition name="fade">
        <window
          ref="receptrion"
          v-show="isReceptionWindowOpen"
          class="reception-window sign-in root-view-space__cell1"
          @close="isReceptionWindowOpen = !isReceptionWindowOpen"
        >
          <div class="reception-window__content">
            <div class="reception-window__cell1 sign-in__avatar-cell">
              <square class="sign-in__avatar">
                <img
                  :src="require('./themes/images/avatar-undefined.png')"
                  alt=""
                >
              </square>
            </div>

            <div class="reception-window__cell2 sign-in__fields-cell">
              <div class="field-row sign-in__field-row_email">
                <field
                  :class="{
                    'sign-in__field': true,
                    '_danger': errors.has('email'),
                    '_focus': emailFocus,
                  }"
                  :icon-src="require('./themes/images/user.png')"
                >
                  <input
                    name="email"
                    v-validate="{
                      required: true,
                      email: true,
                      max: 32,
                    }"
                    data-vv-delay="100"
                    type="text"
                    placeholder="your@email.xxx"
                    tabindex="1"
                    :class="{
                      'input': true,
                      'input_email': true,
                      '_danger': errors.has('email'),
                    }"
                    v-model="emailValue"
                    @focus="emailFocus = true"
                    @blur="emailFocus = false"
                  >
                </field>
                <span
                  v-show="errors.has('email')"
                  class="field-helper _danger"
                >
                  {{errors.first('email')}}
                </span>
              </div>

              <div class="field-row sign-in__field-row_pswd">
                <field
                  :class="{
                    'sign-in__field': true,
                    '_danger': errors.has('password'),
                    '_focus': passFocus,
                  }"
                  :icon-src="require('./themes/images/pass.png')"
                >
                  <input
                    v-validate="{
                      required: true,
                      min: 5,
                      max: 32,
                    }"
                    name="password"
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    tabindex="2"
                    :class="{
                      'input': true,
                      'input_pass': true,
                      '_danger': errors.has('password'),
                    }"
                    v-model="passValue"
                    @focus="passFocus = true"
                    @blur="passFocus = false"
                  >
                </field>
                <span
                  v-show="errors.has('password')"
                  class="field-helper _danger"
                >
                  {{errors.first('password')}}
                </span>
                <ref class="field-row__additional forgot-password">
                  Forgot your password?
                </ref>
              </div>
            </div>

            <div class="reception-window__cell3 sign-in__final-cell">
              <div class="sign-in__remember-part">
                <square
                  class="remember-part__icons"
                >
                  <svg
                    v-if="isUserRemember"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    class="remember-part__icon_check"
                  >
                    <path
                      fill-rule="evenodd"
                      stroke-width="1px"
                      fill="rgb(170, 170, 170)"
                      d="M10.083,2.432 L4.159,8.315 L2.537,6.901 L2.543,6.894 L0.833,5.351 L2.247,3.770 L4.165,5.647 L8.878,0.768 L10.083,2.432 Z"
                    />
                  </svg>
                  <span
                    v-else
                    class="remember-part__icon_cross"
                  >
                    ×
                  </span>
                </square>

                <trigger
                  type="toggle"
                  class="remember-toggle"
                  :item="$data"
                  name="isUserRemember"
                />
                <trigger
                  type="def"
                  :item="$data"
                  name="isUserRemember"
                  is-toggle
                  class="remember-part__question"
                >
                  Remember?
                </trigger>
              </div>
              <button-trigger
                class="sign-in__submit"
                :disable="isSubmitDisable"
                v-bind="!isSubmitDisable && {coloration: 'primary'}"
                :effect-color="isSubmitDisable ? 'rgba(255, 50, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)'"
                @effect-done="signInSubmit"
              >
                Sign in
              </button-trigger>

            </div>
          </div>
        </window>
      </transition>

      <button-trigger
        v-if="!isReceptionWindowOpen"
        class="sign-in__submit root-view-space__cell2"
        effect-color="rgba(0, 0, 0, 0.2)"
        @effect-done="isReceptionWindowOpen = !isReceptionWindowOpen"
        coloration="primary"
      >
        Open reception
      </button-trigger>

      <div class="root-view-space__cell3">
        Not a registered user yet?
        <ref class="sign-up-ref">
          Sign up now!
        </ref>
      </div>
    </div>
  </div>
</template>

<script>
const
  styleRules = {
    rootViewSpace: {
      display: 'flex',
      width: '100%',
      height: '100%',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }
;
export default {
  data() {
    return {
      styleRules,
      isReceptionWindowOpen: false,
      isUserRemember: false,
      isSubmitDisable: true,
      emailFocus: false,
      passFocus: false,
      isShowSuccsess: false,
      emailValue: '',
      passValue: '',
    };
  },
  computed: {
    classes() {
      return this.$jss.createObservableStyleSheet(this, 'styleRules').classes;
    },
  },
  /**/
  watch: {
    errors: {
      deep: true,
      handler() {
        this.validateReceptionForm();
      },
    },
    emailValue() {
      this.isShowSuccsess = false;
    },
    passValue() {
      this.isShowSuccsess = false;
    },
  },
  /**/
  methods: {
    validateReceptionForm() {
      let
        errors = this.errors.all()
      ;
      if(errors.length) {
        this.isSubmitDisable = true;
        return false;
      } else {
        this.isSubmitDisable = false;
        return true;
      }
    },
    /**/
    signInSubmit() {
      let
        isReceptionFormValid = this.validateReceptionForm()
      ;
      if(isReceptionFormValid) {
        this.isShowSuccsess = true;
      }
    },

    keydownSubmitReception(event) {
      if((this.emailFocus || this.passFocus) && event.key === 'Enter') {
        this.signInSubmit();
      }
    },
  },
  /**/
  mounted() {
    this.validateReceptionForm();
    document.addEventListener('keydown', this.keydownSubmitReception, true);
  },
  /**/
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownSubmitReception, true);
  },
};
</script>

<style lang="scss" scoped>
  /*TRANSITION*/
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
      &:before, &:after {
        display: none;
      }
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  /*/TRANSITION/*/
  .root-view-space__content {
    max-width: 353px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    z-index: 0;
  }
    .reception-window {
      $background: #fff;
      $bo-rad: 3px;
      $border: 1px solid #e0e0e0;
      background: $background;
      border: $border;
      border-radius: $bo-rad;
      width: 100%;
      position: relative;
        &:before, &:after {
          content: '';
          position: absolute;
          background: $background;
          width: 100%;
          height: 100%;
          border-radius: $bo-rad;
          border: $border;
        }
        &:before {
          $w-h: calc(100% - 2px);
          z-index: -1;
          bottom: -3px;
          width: $w-h;
          height: $w-h;
        }
         &:after {
           box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
           $w-h: calc(100% - 4px);
           z-index: -2;
           width: $w-h;
           height: $w-h;
           bottom: -5px;
         }
    }
    .reception-window__content {
      max-width: 225px;
      width: 100%;
      padding-right: 8px;
    }
      [class*='root-view-space__cell'] {
          &:not(:first-child) {
            margin-top: 15px;
          }
      }
      .root-view-space__cell1 {

      }
      .root-view-space__cell2 {

      }
      .root-view-space__cell3 {
        word-spacing: 2px;
        padding: 0px 5px;
      }
        .sign-up-ref {
          color: #72985a;
        }
      .reception-window {

      }
        [class*='reception-window__cell'] {
          display: flex;
          width: 100%;
            &:not(:first-child) {
              margin-top: 15px;
            }
        }
        .reception-window__cell1 {

        }
        .reception-window__cell2 {

        }
        .reception-window__cell3 {

        }
        .sign-in__avatar-cell {
          justify-content: center;
          padding-right: 8px;
          margin-top: -4px;
        }
          .sign-in__avatar {
            max-width: 53px;
            min-width: 50px;
            border-radius: 50%;
            box-shadow: 0px 0px 1px 0px #fff, inset 0px 0px 1px 1px rgba(0, 0, 0, .2);
            overflow: hidden;
            background: #f4f4f4;
          }
        .sign-in__fields-cell {
          flex-direction: column;
        }
          [class*='sign-in__field-row_'] {
            width: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
              &:not(:first-child) {
                margin-top: 17px;
              }
          }
            .sign-in__field {
              width: 100%;
                &._danger {
                  border-color: #d08181;
                }
                &:not(._focus) {
                    /deep/ .icon {
                      opacity: 0.5;
                    }
                }
                &._focus {
                    &:not(._danger) {
                      border-color: #72985a;
                    }
                }
            }
              .input {
                padding: 3px 5px 3px 10px;
                color: inherit;
              }
              .field-helper {
                position: absolute;
                top: 100%;
                margin-top: 2px;
                font-size: 10px;
                color: #d08181;
              }
              .input_email {

              }
              .input_pass {
                font-size: 16px;
                letter-spacing: 1px;
              }
            .field-row__additional {
              margin-top: 5px;
            }
          .sign-in__field-row_email {

          }
          .sign-in__field-row_passwd {

          }
            .forgot-password {

            }
        .sign-in__final-cell {
          align-items: center;
          justify-content: space-between;
        }
          .sign-in__remember-part {
            display: flex;
            align-items: center;
          }
            .remember-part__icons {
              max-width: 12px;
            }
              .remember-part__icon_check {
                width: 11px;
                height: 9px;
              }
              .remember-part__icon_cross {
                font-size: 16px;
              }

            .remember-toggle {
              width: 50px;
            }
            .remember-part__question {
              margin-left: 6px;
            }
          .sign-in__submit {
            margin-left: 10px;
          }
</style>

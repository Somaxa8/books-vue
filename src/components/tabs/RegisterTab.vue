<template>
    <div>
        <div class="d-flex flex-column">
            <v-img :src="dark ? require('@/assets/logo-dark.png') : require('@/assets/logo.png')" width="200" @click="dark = !dark" class="mb-16"/>
        </div>
        <v-form ref="form" class="pt-4">
            <h1 class="text-center text-md-left mb-6">Regístrate</h1>
            <v-text-field
                @keydown.enter="$refs.registerButton.$el.click()"
                v-model="email" label="Email" name="email"
                prepend-icon="mdi-email" type="email"
                :rules="emailRules" outlined pre
            />
            <div class="d-flex">
                <v-text-field
                    @keydown.enter="$refs.registerButton.$el.click()"
                    v-model="name" label="Nombre" name="name" outlined
                    prepend-icon="mdi-account" :rules="nameRules"
                    class="mr-5"
                />
                <v-text-field
                    @keydown.enter="$refs.registerButton.$el.click()"
                    v-model="lastname" label="Apellido" name="lastname"
                    :rules="lastnameRules" outlined
                />
            </div>

            <v-text-field
                @keydown.enter="$refs.registerButton.$el.click()"
                v-model="password" label="Contraseña"
                name="password" prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword" outlined
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :rules="passwordRules"
            />
            <v-btn
                class="mb-6 mt-4" :loading="loading"
                ref="registerButton" :key="registerButtonReset" block
                color="primary" large @click.once="register">Regístrarse
            </v-btn>
        </v-form>
        <h4 class="mb-6">Ya tienes una cuenta? <span class="deep-purple--text v-chip--clickable" @click="login">Inicia sesión</span></h4>
        <div>
            <div class="grey--text">Hecho por Somaxa8, contáctame!</div>
            <div class="d-flex">
                <v-btn v-for="(item, i) in social" :key="i" icon @click="redirect(item.url)">
                    <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from "vue-property-decorator";
import StringTool from "@/services/tool/StringTool";
import SessionModule from "@/store/SessionModule";
import {getModule} from "vuex-module-decorators";
import LoginService from "@/services/LoginService";
import SnackbarModule from "@/store/SnackbarModule";
import UserService from "@/services/UserService";

@Component
export default class RegisterTab extends Vue {
    @Ref() readonly form!: HTMLFormElement
    @Ref() readonly registerButton!: HTMLButtonElement
    @Prop() readonly login!: any
    sessionModule: SessionModule = getModule(SessionModule)
    email: string = ""
    name: string = ""
    lastname: string = ""
    password: string = ""
    showPassword: boolean = false
    loading: boolean = false
    registerButtonReset = 1
    emailRules = [
        (v: string) => v.length > 0 ? true : "Email requerido",
        (v: string) => StringTool.validateEmail(v) ? true : "Email no es válido"
    ]
    nameRules = [(v: string) => v.length > 1 ? true : "El nombre debe contener 2 caracteres minimo",]
    lastnameRules = [(v: string) => v.length > 1 ? true : "El apellido debe contener 2 caracteres minimo",]
    passwordRules = [
        (v: string) => v.length > 0 ? true : "Contraseña requerida"
    ]
    social = [
        { icon: "mdi-github", url: "https://github.com/Somaxa8" },
        { icon: "mdi-twitter", url: "https://twitter.com/Somaxa8" },
        { icon: "mdi-gmail", url: "mailto:silviofrancoxa8@gmail.com" },
        { icon: "mdi-linkedin", url: "https://www.linkedin.com/in/silvio-eduardo-franco-chacin-6b9b5320a" }
    ]

    get dark() {
        return this.$vuetify.theme.dark
    }

    set dark(v: boolean) {
        this.sessionModule.session.dark = v
        this.sessionModule.saveSession()
        this.$vuetify.theme.dark = v
    }

    register() {
        if (this.form.validate()) {
            UserService.postUser(this, this.name, this.lastname, this.email, this.password)
        }
    }

}
</script>

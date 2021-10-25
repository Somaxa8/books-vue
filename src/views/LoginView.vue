<template>
    <v-container fluid class="pa-0 fill-height overflow-hidden">
        <v-row class="pa-0 fill-height">
            <v-col cols="12" md="6" class="pa-0">
                <v-tabs class="d-none" hide-slider v-model="tab">
                    <v-tab>Login</v-tab>
                    <v-tab>Register</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab" class="fill-height">
                    <v-tab-item class="pa-15 pb-0">
                        <div class="d-flex flex-column align-center align-md-start mb-0 mb-md-8">
                            <v-img :src="dark ? require('@/assets/logo-dark.png') : require('@/assets/logo.png')" width="200" @click="dark = !dark" class="mb-4 mb-md-6"/>
                        </div>
                        <v-form ref="form" class="pt-0 pt-md-10">
                            <h1 class="text-center text-md-left mb-6">Accede a tu cuenta</h1>
                            <v-text-field
                                @keydown.enter="$refs.loginButton.$el.click()"
                                v-model="email" label="Email" name="email"
                                prepend-icon="mdi-email" type="email" outlined
                                :rules="emailRules"
                            />

                            <v-text-field
                                @keydown.enter="$refs.loginButton.$el.click()"
                                v-model="password" label="Contraseña"
                                name="password" prepend-icon="mdi-lock"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword" outlined
                                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" :rules="passwordRules"
                            />
                            <v-btn
                                class="mb-6 mt-4" :loading="progress"
                                ref="loginButton" :key="loginButtonReset" block
                                color="primary" large @click.once="login()">Acceder
                            </v-btn>
                        </v-form>

                        <h4 class="mb-6">No estás registrado? <span class="deep-purple--text v-chip--clickable" @click="tab = 1">Crea una cuenta</span></h4>
                        <div>
                            <div class="grey--text text-center text-md-start">Hecho por Somaxa8, contáctame!</div>
                            <div class="d-flex justify-center justify-md-start">
                                <v-btn v-for="(item, i) in social" :key="i" icon @click="redirect(item.url)">
                                    <v-icon>{{ item.icon }}</v-icon>
                                </v-btn>
                            </div>
                        </div>
                    </v-tab-item>
                    <v-tab-item class="pa-15 pb-0">
                        <RegisterTab :login="() => tab = 0"/>
                    </v-tab-item>
                </v-tabs-items>
            </v-col>
            <v-col md="6" class="d-none d-md-block pa-0">
                <v-img src="@/assets/background.jpg" class="fill-height" gradient="to top right, rgba(80, 36, 90, 0.7), rgba(80, 36, 90, 0.7)">
                    <div class="fill-height d-flex justify-center align-center pa-16">
                        <div>
                            <div class="d-flex justify-center" style="width: 100%">
                                <div>
                                    <v-img src="@/assets/logo-dark.png" width="300" class="mb-4"/>
                                </div>
                            </div>

                            <div class="text-center grey--text text--lighten-2 text-h6 pa-8 pt-0">
                                Somacode Books es un portal web para descargar libros gratis y de forma legal. Todos nuestros libros están en domino público o con licencias abiertas.
                            </div>
                        </div>
                    </div>
                </v-img>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">

import {Component, Ref, Vue} from "vue-property-decorator";
import StringTool from "@/services/tool/StringTool";
import LoginService from "@/services/LoginService";
import SessionModule from "@/store/SessionModule";
import {getModule} from "vuex-module-decorators";
import SnackbarModule from "@/store/SnackbarModule";
import Session from "@/models/Session";
import ProfileTool from "@/services/tool/ProfileTool";
import RegisterTab from "@/components/tabs/RegisterTab.vue";

@Component({components:{RegisterTab}})
export default class LoginView extends Vue {
    @Ref() readonly form!: HTMLFormElement
    @Ref() readonly loginButton!: HTMLButtonElement
    sessionModule: SessionModule = getModule(SessionModule)
    tab: number = 0
    email: string = ""
    password: string = ""
    showPassword: boolean = false
    progress: boolean = false
    loginButtonReset = 1
    emailRules = [
        (v: string) => v.length > 0 ? true : "Email requerido",
        (v: string) => StringTool.validateEmail(v) ? true : "Email no es válido"
    ]
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

    created() {

        this.sessionModule.setSession(new Session());
        this.sessionModule.saveSession()
    }

    login() {
        if (this.form.validate()) {
            LoginService.postLogin(this, this.email, this.password, getModule(SnackbarModule), this.sessionModule)
        }
    }

    redirect(url : string) {
        window.open(url)
    }
}
</script>
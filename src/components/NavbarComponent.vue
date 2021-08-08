<template>
    <v-app-bar app clipped-left elevation="0">
        <v-toolbar-title class="mr-8">Somacode Books</v-toolbar-title>

        <v-btn class="ma-1" elevation="0">Inicio</v-btn>
        <v-btn class="ma-1" elevation="0">Mis Libros</v-btn>
        <v-btn class="ma-1" elevation="0">Mis Favoritos</v-btn>

        <v-spacer/>

        <div class="pt-2 mr-4">
            <v-checkbox
                class="pt-3" v-model="dark"
                off-icon="mdi-theme-light-dark"
                on-icon="mdi-theme-light-dark"
            />
        </div>

        <v-btn text large class="pa-1">
            <div class="d-flex flex-column align-end mr-2">
                <span class="grey--text text-capitalize" style="font-size: 10px">Admin</span>
                <span class="text-capitalize">Silvio Franco</span>
            </div>
            <v-avatar color="indigo" size="35" rounded>
                <v-icon dark>
                    mdi-account-circle
                </v-icon>
            </v-avatar>
        </v-btn>

    </v-app-bar>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {getModule} from "vuex-module-decorators";
import SnackbarModule from "@/store/SnackbarModule";
import LoginService from "@/services/LoginService";
import SessionModule from "@/store/SessionModule";
import ConstantTool from "@/services/tool/ConstantTool";

@Component
export default class NavbarComponent extends Vue {
    sessionModule: SessionModule = getModule(SessionModule)
    snackbarModule: SnackbarModule = getModule(SnackbarModule)
    projectName: string = ConstantTool.PROJECT_NAME

    get dark() {
        return this.$vuetify.theme.dark
    }

    set dark(v: boolean) {
        this.sessionModule.session.dark = v
        this.sessionModule.saveSession()
        this.$vuetify.theme.dark = v
    }

    logout() {
        LoginService.logout(this)
    }
}
</script>

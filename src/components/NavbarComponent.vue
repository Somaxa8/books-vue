<template>
    <v-app-bar app clipped-left height="80" elevate-on-scroll>
        <v-toolbar-title class="mr-8">{{projectName}}</v-toolbar-title>

        <v-btn class="ma-1 text-capitalize" elevation="0" @click="$router.push('/')">Inicio</v-btn>
        <v-btn class="ma-1 text-capitalize" elevation="0" @click="$router.push('/books/@me')">Mis Libros</v-btn>
        <v-btn class="ma-1 text-capitalize" elevation="0">Mis Favoritos</v-btn>

        <v-spacer/>

        <div class="pt-2 mr-4">
            <v-checkbox
                class="pt-3" v-model="dark"
                off-icon="mdi-theme-light-dark"
                on-icon="mdi-theme-light-dark"
            />
        </div>

        <v-btn text large class="pa-1" @click="drawerModule.closeOpenDrawer">
            <div class="d-flex flex-column align-end mr-2">
                <span class="grey--text text-capitalize" style="font-size: 10px">
                    {{sessionModule.session.authorities[0].title}}
                </span>
                <span class="text-capitalize">{{sessionModule.session.user.name + " " + sessionModule.session.user.lastname}}</span>
            </div>
            <v-avatar color="indigo" size="35" rounded>
                <v-img v-if="sessionModule.session.user.avatar" :src="sessionModule.session.user.avatar.url" alt="Avatar" />
                <v-icon v-else dark>
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
import DrawerModule from "@/store/DrawerModule";

@Component
export default class NavbarComponent extends Vue {
    sessionModule: SessionModule = getModule(SessionModule)
    snackbarModule: SnackbarModule = getModule(SnackbarModule)
    projectName: string = ConstantTool.PROJECT_NAME
    drawerModule: DrawerModule = getModule(DrawerModule)

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

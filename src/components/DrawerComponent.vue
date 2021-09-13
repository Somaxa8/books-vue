<template>
    <v-navigation-drawer right fixed bottom temporary v-model="enabled" width="375">
        <v-list dense nav class="pa-6 pt-2">
            <v-list-item-group>
                <v-list-item inactive selectable>
                    <v-list-item-title class="text-h6">Perfil de Usuario</v-list-item-title>
                    <v-list-item-action>
                        <v-btn icon tile elevation="0" width="24" height="24" style="border-radius: 5px" @click="drawerModule.closeOpenDrawer">
                            <v-icon size="16">mdi-close</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item two-line>
                    <v-badge bordered top color="#1BC5BD" dot offset-x="13" offset-y="7">
                        <v-avatar color="indigo" size="100" class="mr-2" rounded>
                            <v-img v-if="sessionModule.session.user.avatar" :src="sessionModule.session.user.avatar.url" alt="Avatar" />
                            <v-icon v-else dark>
                                mdi-account-circle
                            </v-icon>
                        </v-avatar>
                    </v-badge>
                    <v-list-item-content class="ml-2">
                        <strong class="subtitle-2 text-capitalize" style="font-size: 17px !important;">
                            {{sessionModule.session.user.name + " " + sessionModule.session.user.lastname}}
                        </strong>
                        <span class="grey--text text-capitalize" style="font-size: 14px">
                            {{sessionModule.session.authorities[0].title}}
                        </span>
                        <div>
                            <v-badge bordered top color="blue-grey lighten-4" dot offset-x="10" offset-y="18">
                                <v-icon size="18" class="mr-1" color="primary">mdi-email</v-icon>
                            </v-badge>
                            <span style="font-size: 14px" class="grey--text">{{sessionModule.session.user.email}}</span>
                        </div>
                        <div>
                            <v-btn color="primary" small elevation="0" width="110" @click="logout">Cerrar Sesión</v-btn>
                        </div>
                    </v-list-item-content>

                </v-list-item>
                <v-divider class="my-2 mt-6 mb-6" />

                <v-list-item v-for="item in items" @click="$router.push(item.to)">
                    <v-list-item-icon style="margin-top: 5px">
                        <v-avatar color="deep-purple lighten-4" size="40" class="mr-2" rounded>
                            <v-icon :color="item.color">{{ item.icon }}</v-icon>
                        </v-avatar>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import SessionModule from "@/store/SessionModule";
import {getModule} from "vuex-module-decorators";
import DrawerModule from "@/store/DrawerModule";
import LoginService from "@/services/LoginService";

@Component
export default class DrawerComponent extends Vue {
    sessionModule: SessionModule = getModule(SessionModule)
    drawerModule: DrawerModule = getModule(DrawerModule)
    items = [
        {title: "Mi Perfil", subtitle: "Configuración de la cuenta y más", color: "light-green", icon: "mdi-card-account-details", to: "/profile"},
        {title: "Mis Favoritos", subtitle: "Colección de sus libros favoritos", color: "error", icon: "mdi-cards-heart", to: "/"},
        {title: "Mis Libros", subtitle: "Mis libros subidos a la plataforma", color: "purple", icon: "mdi-book-open-page-variant", to: "/books/@me"},
        {title: "Subir Libro", subtitle: "Suba un libro a la plataforma", color: "warning", icon: "mdi-cloud-upload", to: "/books/upload"},
    ]


    get enabled() {
        return this.drawerModule.showDrawer
    }

    set enabled(enabled: boolean) {
        this.drawerModule.setDrawerEnabled(enabled)
    }

    logout() {
        LoginService.logout(this)
    }
}
</script>
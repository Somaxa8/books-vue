<template>
    <v-container>
        <v-row>
            <v-col cols="4">
                <v-card elevation="0">
                    <v-card-text>
                        <div class="d-flex flex-row pl-4 pr-4 mt-4 mb-4">
                            <v-badge bordered top color="#1BC5BD" dot offset-x="13" offset-y="7">
                                <v-avatar color="indigo" size="60" class="mr-2" rounded>
                                    <v-img v-if="sessionModule.session.user.avatar" :src="sessionModule.session.user.avatar.url" alt="Avatar" />
                                    <v-icon v-else dark>
                                        mdi-account-circle
                                    </v-icon>
                                </v-avatar>
                            </v-badge>
                            <div class="d-flex flex-column">
                                <strong class="subtitle-2 text-capitalize" style="font-size: 17px !important;">
                                    {{sessionModule.session.user.name + " " + sessionModule.session.user.lastname}}
                                </strong>
                                <span class="grey--text text-capitalize" style="font-size: 14px">
                                    {{sessionModule.session.authorities[0].title}}
                                </span>
                            </div>
                        </div>
                        <div class="mb-4 pl-4 pr-4">
                            <strong>Rol: </strong> <span class="text-capitalize">{{sessionModule.session.authorities[0].title}}</span> <br>
                            <strong>Email: </strong> {{sessionModule.session.user.email}} <br>
                            <strong>Nombre Completo: </strong> {{sessionModule.session.user.name + " " + sessionModule.session.user.lastname}} <br>
                        </div>
                        <v-list dense nav>
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
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="8">
                <v-card elevation="0" class="mb-8">
                    <v-card-title>
                        <div>
                            Información Personal
                        </div>
                        <v-spacer />
                        <v-btn color="primary" class="text-capitalize" elevation="0" @click="updateUser">
                            Guardar Cambios
                        </v-btn>
                    </v-card-title>
                    <v-divider />
                    <v-progress-linear :indeterminate="true" :active="loading"/>
                    <v-card-text>
                        <v-form ref="form">
                            <div class="d-flex flex-row align-center">
                                <strong class="mr-8">Avatar: </strong>
                                <div>
                                    <div class="mb-2">
                                        <input @change="selectFile" type="file" ref="fileInput" class="d-none" accept=".jpg, .png, .jpeg"/>
                                        <v-avatar color="indigo" size="120" class="mr-2 elevation-6" rounded>
                                            <v-img v-if="sessionModule.session.user.avatar" :src="sessionModule.session.user.avatar.url" alt="Avatar" />
                                            <v-icon v-else dark>
                                                mdi-account-circle
                                            </v-icon>
                                        </v-avatar>
                                        <v-btn fab small width="20" height="20" style="margin-left: -20px; margin-top: -110px" @click="clickInput">
                                            <v-icon size="14">mdi-pencil</v-icon>
                                        </v-btn>
                                    </div>
                                    <span>Tipos de archivo permitidos: png, jpg, jpeg.</span>
                                </div>

                            </div>
                            <div class="mt-5" style="width: 70%">
                                <v-text-field v-model="user.name" outlined label="Nombre"/>
                                <v-text-field v-model="user.lastname" outlined label="Apellido"/>
<!--                                <v-text-field v-model="user.email" filled prepend-inner-icon="mdi-email-edit" label="Email"/>-->
                            </div>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import SessionModule from "@/store/SessionModule";
import {getModule} from "vuex-module-decorators";
import User from "@/models/User";
import UserService from "@/services/UserService";
import Dialog from "@/models/vue/Dialog";
import DialogModule from "@/store/DialogModule";

@Component
export default class ProfileView extends Vue {
    @Ref() readonly form!: HTMLFormElement
    @Ref() readonly fileInput!: HTMLInputElement
    sessionModule: SessionModule = getModule(SessionModule)
    user: User = {...this.sessionModule.session.user}
    loading: boolean = false
    items = [
        {title: "Mis Favoritos", subtitle: "Colección de sus libros favoritos", color: "error", icon: "mdi-cards-heart", to: "/books/@me/favorites"},
        {title: "Mis Libros", subtitle: "Mis libros subidos a la plataforma", color: "purple", icon: "mdi-book-open-page-variant", to: "/books/@me"},
        {title: "Subir Libro", subtitle: "Suba un libro a la plataforma", color: "warning", icon: "mdi-cloud-upload", to: "/"},
    ]

    updateUser() {
        getModule(DialogModule).showDialog(new Dialog(
            "Aviso",
            "¿Está seguro de actualizar su usuario?",
            () => UserService.patchUser(this, this.user)
        ))
    }

    selectFile(event: any) {
        UserService.patchUserAvatar(this, this.user.id!, event.target.files[0])
    }

    clickInput() {
        this.fileInput.click()
    }
}
</script>
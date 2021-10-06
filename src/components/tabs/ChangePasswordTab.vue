<template>
    <div>
        <v-card-title>
            <div>
                Cambiar contraseña
            </div>
            <v-spacer />
            <v-btn color="primary" class="text-capitalize" elevation="0" @click="backProfile">
                <v-icon left>mdi-chevron-left</v-icon>
                Volver
            </v-btn>
        </v-card-title>
        <v-divider />
        <v-progress-linear :indeterminate="true" :active="loading"/>
        <v-card-text>
            <v-form ref="form">
                <v-text-field v-model="password" type="password" outlined label="Contraseña" :rules="password1Rules"/>
                <v-text-field v-model="newPassword1" type="password" outlined label="Nueva Contraseña" :rules="password1Rules"/>
                <v-text-field v-model="newPassword2" type="password" outlined label="Repita su nueva Contraseña" :rules="password2Rules"/>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn color="primary" class="text-capitalize" elevation="0" @click="changePassword">
                Guardar
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from "vue-property-decorator";
import {getModule} from "vuex-module-decorators";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/models/vue/Dialog";
import UserService from "@/services/UserService";
import SessionModule from "@/store/SessionModule";

@Component
export default class ChangePasswordTab extends Vue {
    @Ref() readonly form!: HTMLFormElement
    @Prop() backProfile!: any
    loading: boolean = false
    password: string = ""
    newPassword1: string = ""
    newPassword2: string = ""
    password1Rules = [(v: string) => v.length > 3 ? true : "La contraseña debe tener mínimo 4 caracteres"]
    password2Rules = [() => this.checkPassword() ? true : "Las contraseñas deben coincidir"]

    checkPassword() {
        return this.newPassword1 === this.newPassword2
    }

    changePassword() {
        if (this.form.validate()) {
            getModule(DialogModule).showDialog(new Dialog(
                "Aviso",
                "¿Está seguro de actualizar su contraseña?",
                () => UserService.patchChangePassword(this, this.password, this.newPassword1, getModule(SessionModule).session.user.id!)
            ))
        }
    }
}
</script>
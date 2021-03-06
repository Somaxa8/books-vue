import User from "@/models/User";
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";
import {Vue} from "vue-property-decorator";
import JsonTool from "@/services/tool/JsonTool";
import SnackbarModule from "@/store/SnackbarModule";

export default class UserService {

    static async postUser(component: Vue, name: string, lastname: string, email: string, password: string) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("name", name)
        formData.set("lastname", lastname)
        formData.set("email", email)
        formData.set("password", password)

        try {
            await component.axios.post("/public/users/register", formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.login()
            getModule(SnackbarModule).makeToast("Usuario registrado correctamente!")
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se pudo registrar el usuario")
        }
    }

    static async getUsers(component: Vue, users: User[]) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get("/api/users", {
                headers : {Authorization: getModule(SessionModule).session.token}
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, User)
            users.splice(0, users.length)
            list.forEach(u => users.push(u))
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se pudo obtener los usuarios")
        }
    }

    static async getUser(component: Vue, userId: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get("/api/users/" + userId, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            let entity = JsonTool.jsonConvert.deserializeObject(response.data, User)
            // @ts-ignore
            component.user = entity
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se pudo obtener el usuario")
        }
    }

    static async patchUser(component: Vue, user: User) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.patch("/api/users/" + user.id,
                user, {
                    headers: {Authorization: getModule(SessionModule).session.token}
            })
            getModule(SessionModule).session.user = JsonTool.jsonConvert.deserializeObject(response.data, User)
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se pudo actualizar el usuario")
        }
    }

    static async patchUserAvatar(component: Vue, id: number, avatarFile: File) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("avatarFile", avatarFile)

        try {
            const response = await component.axios.patch("/api/users/" + id + "/avatar/update", formData, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            getModule(SessionModule).session.user = JsonTool.jsonConvert.deserializeObject(response.data, User)
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se pudo actualizar el avatar del usuario")
        }
    }

    static async deleteUserAvatar(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            await component.axios.delete("/api/users/" + id + "/avatar/delete", {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se pudo eliminar el avatar del usuario")
        }
    }

    static async patchChangePassword(component: Vue, password: string, newPassword: string, userId: number) {
        // @ts-ignore
        component.loading = true
        let formData: FormData = new FormData()
        formData.set("password", password)
        formData.set("newPassword", newPassword)
        try {
            await component.axios.patch("/api/users/" + userId + "/change-password",
                formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
            })
            getModule(SnackbarModule).makeToast("Contrase??a cambiada con exito")
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = true
            getModule(SnackbarModule).makeToast("No se pudo cambiar la contrase??a")
        }
    }
}
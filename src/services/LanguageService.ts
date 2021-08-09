import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";
import SnackbarModule from "@/store/SnackbarModule";
import JsonTool from "@/services/tool/JsonTool";
import Language from "@/models/Language";
import {Vue} from "vue-property-decorator";

export default class LanguageService {

    static async getLanguages(component: Vue, languages: Language[]) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get("/public/languages")
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Language)
            languages.splice(0, languages.length)
            list.forEach(v => languages.push(v))
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se han podido obtener los lenguajes");
        }
    }

    static async postLanguage(component: Vue, title: string) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("title", title)

        try {
            await component.axios.post("/api/languages", formData,{
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            getModule(SnackbarModule).makeToast("Se ha agregado el lenguaje correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
            // @ts-ignore
            component.form.reset()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al agregar el lenguaje")
        }
    }

    static async deleteLanguage(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.delete("/api/languages/" + id, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se ha eliminado el lenguaje de manera exitosa!")
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al eliminar el lenguaje")
        }
    }

}
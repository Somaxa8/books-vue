import JsonTool from "@/services/tool/JsonTool";
import {getModule} from "vuex-module-decorators";
import SnackbarModule from "@/store/SnackbarModule";
import SessionModule from "@/store/SessionModule";

export default class BookCategoryService {

    static async getBookCategories(component: Vue, bookCategories: BookCategoryService[]) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get("/public/book-categories")
            let list = JsonTool.jsonConvert.deserializeArray(response.data, BookCategoryService)
            bookCategories.splice(0, bookCategories.length)
            list.forEach(v => bookCategories.push(v))
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se han podido obtener las categorias");
        }
    }

    static async postBookCategories(component: Vue, title: string) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("title", title)

        try {
            await component.axios.post("/api/book-categories", formData,{
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            getModule(SnackbarModule).makeToast("Se ha creado la categoria correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
            // @ts-ignore
            component.form.reset()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al crear la categoria")
        }
    }

    static async patchBookCategories(component: Vue, bookCategory: BookCategoryService) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.patch("/api/book-categories", bookCategory,{
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            getModule(SnackbarModule).makeToast("Se ha editado la categoria correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
            // @ts-ignore
            component.form.reset()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al editar la categoria")
        }
    }

    static async deleteBookCategory(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.delete("/api/book-categories/" + id, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se ha eliminado la categoria de manera exitosa!")
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al eliminar la categoria")
        }
    }

    static async patchBookRelateBookCategory(component: Vue, id: number, bookId: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.patch("/api/book/" + bookId + "/book-categories/" + id + "/relate", {}, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se he hecho la relacion manera exitosa!")
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al relacionar la categoria")
        }
    }

    static async patchBookUnelateBookCategory(component: Vue, id: number, bookId: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.patch("/api/book/" + bookId + "/book-categories/" + id + "/unrelate", {}, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se he hecho la relacion manera exitosa!")
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al relacionar la categoria")
        }
    }
}
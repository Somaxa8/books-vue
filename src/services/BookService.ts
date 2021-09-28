import Book from "@/models/Book";
import JsonTool from "@/services/tool/JsonTool";
import {getModule} from "vuex-module-decorators";
import SnackbarModule from "@/store/SnackbarModule";
import {Vue} from "vue-property-decorator";
import axios from "axios";
import {DateTime} from "luxon";
import SessionModule from "@/store/SessionModule";
import BookCategory from "@/models/BookCategory";

export default class BookService {

    static async getBooks(component: Vue, books: Book[], page: number, size: number, search: string, categoryId: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get("/public/books", {
                params: { page, size, categoryId, search }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Book)
            books.splice(0, books.length)
            list.forEach(v => books.push(v))
            // @ts-ignore
            component.totalItems = Number(response.headers["x-total-count"])
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se han podido obtener los libros");
        }
    }

    static async getMyBooks(component: Vue, books: Book[], page: number, size: number, search: string, categoryId: number, start: string | undefined, end: string | undefined) {
        // @ts-ignore
        component.loading = true
        const userId = getModule(SessionModule).session.user.id
        try {
            const response = await component.axios.get("/api/@me/users/" + userId + "/books", {
                params: { page, size, search, categoryId, start, end },
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Book)
            books.splice(0, books.length)
            list.forEach(v => books.push(v))
            // @ts-ignore
            component.totalItems = Number(response.headers["x-total-count"])
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se han podido obtener tus libros")
        }
    }

    static async getFavoriteBooks(component: Vue, books: Book[], page: number, size: number, search: string, categoryId: number,) {
        // @ts-ignore
        component.loading = true

        const userId = getModule(SessionModule).session.user.id

        try {
            const response = await component.axios.get("/api/users/" + userId + "/books/favorites", {
                params: { page, size, search, categoryId },
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Book)
            books.splice(0, books.length)
            list.forEach(v => books.push(v))
            // @ts-ignore
            component.totalItems = Number(response.headers["x-total-count"])
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("No se han podido obtener tus libros favoritos")
        }
    }

    static async getBook(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await axios.get("/public/books/" + id)
            // @ts-ignore
            component.book = JsonTool.jsonConvert.deserializeObject(response.data, Book)
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al obtener el libro")
        }
    }

    static async postBook(
        component: Vue, languageId: string, title: string, author: string, editorial: string, description: string, bookFile: File, categories: BookCategory[]
    ) {
        // @ts-ignore
        component.loading = true

        let categoryIds: string = ""
        for (let category of categories) {
            categoryIds = categoryIds + category.id + ","
        }
        categoryIds = categoryIds.slice(0, categoryIds.length - 1)

        let formData = new FormData()
        formData.set("title", title)
        formData.set("author", author!)
        formData.set("languageId", languageId)
        formData.set("categoryIds", categoryIds)
        formData.set("editorial", editorial!)
        formData.set("description", description!)
        formData.set("bookFile", bookFile)

        try {
            await component.axios.post("/api/books", formData, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            getModule(SnackbarModule).makeToast("Se ha creado el libro correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.form.reset()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al crear el libro")
        }
    }

    static async patchBook(component: Vue, id: number, languageId: number, bookFile: File | null, book: Book) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("title", book.title!)
        formData.set("author", book.author!)
        formData.set("date", book.date!.toString())
        formData.set("languageId", languageId.toString())
        formData.set("editorial", book.editorial!)
        formData.set("description", book.description!)
        formData.set("bookFile", bookFile!)

        try {
            await component.axios.patch("/api/books/" + id, formData, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al editar el libro")
        }
    }

    static async deleteBook(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.delete("/api/books/" + id, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se ha eliminado el libro de manera exitosa!")
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al eliminar el libro")
        }
    }

    static async favoriteBook(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.patch("/api/books/" + id + "/favorite", null, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Se ha agregado el libro a mis favoritos")
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al agregar el libro a mis favoritos")
        }
    }

    static async unfavoriteBook(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.patch("/api/books/" + id + "/unfavorite", null, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh()
            getModule(SnackbarModule).makeToast("Se ha eliminado el libro de mis favoritos")
        } catch (err) {
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al eliminar el libro de mis favoritos")
        }
    }

}
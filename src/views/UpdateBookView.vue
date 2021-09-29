<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card class="mb-6">
                    <v-card-title>
                        <div>
                            Actualizar libro
                        </div>
                        <v-spacer />
                        <v-btn @click="createBook" color="primary" class="text-capitalize">Actualizar</v-btn>
                    </v-card-title>
                    <v-divider />
                    <v-progress-linear :indeterminate="true" :active="loading"/>
                    <v-card-text>
                        <v-form ref="form" >
                            <v-container>
                                <v-row>
                                    <v-col cols="3">
                                        <v-card color="primary" class="d-flex justify-center align-center mb-6" height="340" @click="coverMessage">
                                            <v-icon x-large>mdi-image</v-icon>
                                        </v-card>
                                        <v-text-field v-model="book.author" outlined label="Autor" :rules="textFieldRules"/>
                                        <v-text-field v-model="book.editorial" outlined label="Editorial" :rules="textFieldRules"/>
                                    </v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="book.title" outlined label="Titulo" :rules="titleRules"/>
                                        <v-file-input v-model="bookFile" label="Libro" outlined prepend-inner-icon="mdi-book-open-page-variant" prepend-icon="" accept=".epub,.pdf"/>
                                        <v-combobox v-model="book.categories" :items="categories" item-text="title" outlined label="Categorias*" prepend-inner-icon="mdi-shape" multiple chips :rules="categoriesRules"/>
                                        <v-select v-model="book.language" :items="languages" item-text="title" outlined label="Lenguaje*" prepend-inner-icon="mdi-translate" :rules="selectRules"/>
                                        <v-textarea v-model="book.description" label="Descripción" outlined rows="5" :rules="textFieldRules"/>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import BookCategory from "@/models/BookCategory";
import BookCategoryService from "@/services/BookCategoryService";
import Language from "@/models/Language";
import LanguageService from "@/services/LanguageService";
import {getModule} from "vuex-module-decorators";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/models/vue/Dialog";
import BookService from "@/services/BookService";
import SnackbarModule from "@/store/SnackbarModule";
import Book from "@/models/Book";

@Component
export default class UpdateBookView extends Vue {
    @Ref() readonly form!: HTMLFormElement
    loading: boolean = false
    categories: BookCategory[] = []
    languages: Language[] = []
    book: Book = new Book()
    categoriesSelected: BookCategory[] = []
    bookFile: File | null = null
    titleRules = [
        (v: string) => v.length == 0 || v.length > 1 ? true : "El campo debe tener minimo 2 caracteres",
    ]
    selectRules = [(v: string) => v ? true : "Campo requerido"]
    categoriesRules = [(v: []) => v.length > 0 ? true : "Campo requerido"]
    textFieldRules = [(v: string) => v.length == 0 || v.length > 1 ? true : "El campo debe tener minimo 2 caracteres"]

    created() {
        BookCategoryService.getBookCategories(this, this.categories)
        LanguageService.getLanguages(this, this.languages)
        BookService.getBook(this, Number(this.$route.params.bookId))
    }

    createBook() {
        if (this.form.validate()) {
            getModule(DialogModule).showDialog(new Dialog(
                "Aviso",
                "¿Está seguro de actualizar este libro?",
                () => BookService.patchBook(this, this.book.id!, this.book.language!.id!.toString(), this.bookFile, this.book)
            ))
        }
    }

    coverMessage() {
        getModule(SnackbarModule).makeToast("La imagen de portada sera tomada del libro en cuestión.")
    }
}
</script>
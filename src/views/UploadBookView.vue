<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card class="mb-6">
                    <v-card-title>
                        <div>
                            Subir libro
                        </div>
                        <v-spacer />
                        <v-btn @click="createBook" color="primary" class="text-capitalize">Subir</v-btn>
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
                                        <v-text-field v-model="author" outlined label="Autor" :rules="textFieldRules"/>
                                        <v-text-field v-model="editorial" outlined label="Editorial" :rules="textFieldRules"/>
                                    </v-col>
                                    <v-col cols="9">
                                        <v-text-field v-model="title" outlined label="Titulo*" :rules="titleRules"/>
                                        <v-file-input v-model="bookFile" label="Libro*" outlined prepend-inner-icon="mdi-book-open-page-variant" prepend-icon="" accept=".epub,.pdf" :rules="fileRules"/>
                                        <v-combobox v-model="categoriesSelected" :items="categories" item-text="title" outlined label="Categorias*" prepend-inner-icon="mdi-shape" multiple chips :rules="categoriesRules"/>
                                        <v-select v-model="languageId" :items="languages" item-value="id" item-text="title" outlined label="Lenguaje*" prepend-inner-icon="mdi-translate" :rules="selectRules"/>
                                        <v-textarea v-model="description" label="Descripción" outlined rows="5" :rules="textFieldRules"/>
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

@Component
export default class UploadBookView extends Vue {
    @Ref() readonly form!: HTMLFormElement
    loading: boolean = false
    categories: BookCategory[] = []
    languages: Language[] = []
    title: string = ""
    description: string = ""
    author: string = ""
    editorial: string = ""
    categoriesSelected: BookCategory[] = []
    languageId: string = ""
    bookFile: File | null = null
    titleRules = [
        (v: string) => v && v.length > 0 ? true : "Campo requerido",
        (v: string) => v.length > 1 ? true : "El campo debe tener minimo 2 caracteres",
    ]
    fileRules = [(v: File) => v ? true : "Campo requerido"]
    selectRules = [(v: string) => v ? true : "Campo requerido"]
    categoriesRules = [(v: []) => v.length > 0 ? true : "Campo requerido"]
    textFieldRules = [(v: string) => v || v.length == 0 || v.length > 1 ? true : "El campo debe tener minimo 2 caracteres"]

    created() {
        BookCategoryService.getBookCategories(this, this.categories)
        LanguageService.getLanguages(this, this.languages)
    }

    createBook() {
        if (this.form.validate()) {
            getModule(DialogModule).showDialog(new Dialog(
                "Aviso",
                "¿Está seguro de crear este libro?",
                () => BookService.postBook(this, this.languageId, this.title, this.author, this.editorial, this.description, this.bookFile!, this.categoriesSelected)
            ))
        }
    }

    coverMessage() {
        getModule(SnackbarModule).makeToast("La imagen de portada sera tomada del libro en cuestión.")
    }

    reset() {
        this.title = ""
        this.description = ""
        this.author = ""
        this.editorial = ""
        this.languageId = ""
        this.categoriesSelected = []
        this.bookFile = null
    }
}
</script>
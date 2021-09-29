<template>
    <v-container>
        <v-card>
            <v-card-title>Mis Libros</v-card-title>
            <v-card-text>
                <v-skeleton-loader v-if="fistLoading" type="table"/>
                <v-data-table
                    :headers="headers" :items="books" hide-default-footer :loading="loading"
                    :show-select="false" @page-count="pageCount = $event" loading-text="Cargando..."
                    :search="search" no-results-text="No hay resultados" no-data-text="No hay resultados"
                    disable-sort v-else
                >
                    <template v-slot:top>
                        <v-container class="pa-0">
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field v-model="search" dense outlined label="Buscar"/>
                                </v-col>
                                <v-col cols="3">
                                    <v-select v-model="categoryId" @change="refresh" dense outlined :items="categories" label="Categorias" clearable item-text="title" item-value="id"/>
                                </v-col>
                                <v-col cols="3">
                                    <v-dialog ref="dialog" v-model="modal" :return-value.sync="dates" persistent width="290px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="dates" @click:clear="dates = []" dense outlined label="Fechas" clearable append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"/>
                                        </template>
                                        <v-date-picker v-model="dates" light year-icon="mdi-calendar-blank" prev-icon="mdi-skip-previous" next-icon="mdi-skip-next" multiple range>
                                            <v-spacer />
                                            <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                                            <v-btn text color="primary" @click="$refs.dialog.save(dates)">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>
                    <template v-slot:item.actions="{item}">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn class="ma-1" icon v-bind="attrs" v-on="on" @click="redirect(item.book.url)">
                                    <v-icon>mdi-download</v-icon>
                                </v-btn>
                            </template>
                            <span>Descargar</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn class="ma-1" icon v-bind="attrs" v-on="on" @click="$router.push('/books/' + item.id)">
                                    <v-icon>mdi-eye</v-icon>
                                </v-btn>
                            </template>
                            <span>Ver</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn class="ma-1" icon v-bind="attrs" v-on="on" @click="$router.push('/books/update/' + item.id)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="error" v-bind="attrs" v-on="on" @click="deleteBook(item.id)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.book.extension="{item}">
                        <v-chip class="ma-2" :color="item.book.extension == 'epub' ? 'error' : 'warning'" label outlined>
                            {{item.book.extension.toUpperCase()}}
                        </v-chip>
                    </template>
                    <template v-slot:item.createdAt="{item}">
                        {{item.createdAt.setLocale("es").toFormat('dd/MM/yy')}}
                    </template>
                    <template v-slot:footer>
                        <v-divider/>
                        <v-row class="mt-2" align="center" justify="center">
                            <v-btn class="ma-2" outlined color="primary" width="200" light @click="$router.push('/books/upload')">
                                Subir libro
                            </v-btn>

                            <v-spacer />

                            <div class="text-center pt-2">
                                <v-pagination v-model="page" :length="pageCount"/>
                            </div>
                        </v-row>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import Options from "@/models/vue/Options";
import Book from "@/models/Book";
import BookService from "@/services/BookService";
import {getModule} from "vuex-module-decorators";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/models/vue/Dialog";
import BookCategory from "@/models/BookCategory";
import BookCategoryService from "@/services/BookCategoryService";

@Component
export default class MyBooksView extends Vue {
    books: Book[] = []
    pageCount: number = 0
    fistLoading: boolean = true
    loading: boolean = false
    page: number = 1
    itemsPerPage: number = 20
    totalItems: number = 0
    options: Options = new Options()
    search: string = ""
    categories: BookCategory[] = []
    categoryId!: number
    // picker: string = ""
    modal: boolean = false
    dates: string[] = []
    headers = [
        { text: "TITULO", value: "title", width: "150px" },
        { text: "AUTOR", value: "author", width: "150px" },
        { text: "EDITORIAL", value: "editorial", width: "80px" },
        { text: "LENGUAJE", value: "language.title", width: "80px" },
        { text: "EXTENSIÓN", value: "book.extension", width: "80px" },
        { text: "ACCIONES", value: "actions", width: "170px" },
        { text: "SUBIDO EL", value: "createdAt", width: "150px" }
    ]

    async refresh() {
        await BookService.getMyBooks(this, this.books, this.page - 1, this.itemsPerPage, this.search, this.categoryId, this.dates[0], this.dates[1])
        this.fistLoading = false
    }

    created() {
        BookCategoryService.getBookCategories(this, this.categories)
        this.refresh()
    }

    redirect(url : string) {
        window.open(url)
    }

    deleteBook(id: number) {
        getModule(DialogModule).showDialog(new Dialog(
            "Aviso",
            "¿Está seguro de eliminar este libro?",
            () => BookService.deleteBook(this, id)
        ))
    }

    @Watch("dates")
    watchDatePicker() {
        this.refresh()
    }

}
</script>
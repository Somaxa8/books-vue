<template>
    <v-container>
        <v-card>
            <v-card-title>Mis Favoritos</v-card-title>
            <v-card-text>
                <v-data-table
                    :headers="headers" :items="books" hide-default-footer :loading="loading"
                    :show-select="false" @page-count="pageCount = $event" loading-text="Cargando..."
                    :search="search" no-results-text="No hay resultados" no-data-text="No hay resultados"
                    disable-sort
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
                                <v-btn icon color="error" v-bind="attrs" v-on="on" @click="unfavorite(item.id)">
                                    <v-icon>mdi-heart-off</v-icon>
                                </v-btn>
                            </template>
                            <span>Quitar de favoritos</span>
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
export default class FavoriteBooksView extends Vue {
    books: Book[] = []
    pageCount: number = 0
    loading: boolean = false
    page: number = 1
    itemsPerPage: number = 20
    totalItems: number = 0
    options: Options = new Options()
    search: string = ""
    categories: BookCategory[] = []
    categoryId!: number
    headers = [
        { text: "TITULO", value: "title", width: "150px" },
        { text: "AUTOR", value: "author", width: "150px" },
        { text: "EDITORIAL", value: "editorial", width: "80px" },
        { text: "LENGUAJE", value: "language.title", width: "80px" },
        { text: "EXTENSIÓN", value: "book.extension", width: "80px" },
        { text: "ACCIONES", value: "actions", width: "170px" }
    ]

    refresh() {
        BookService.getFavoriteBooks(this, this.books, this.page - 1, this.itemsPerPage, this.search, this.categoryId)
    }

    created() {
        BookCategoryService.getBookCategories(this, this.categories)
        this.refresh()
    }

    redirect(url : string) {
        window.open(url)
    }

    unfavorite(id: number) {
        getModule(DialogModule).showDialog(new Dialog(
            "Aviso",
            "¿Está seguro de quítar este libro de tus favoritos?",
            () => BookService.unfavoriteBook(this, id)
        ))
    }

}
</script>
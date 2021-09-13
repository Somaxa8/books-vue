<template>
    <v-container>
        <v-card>
            <v-card-title>Mis Libros</v-card-title>
            <v-card-text>
                <v-data-table
                    :headers="headers" :items="books" hide-default-footer :loading="loading"
                    :show-select="false" @page-count="pageCount = $event" loading-text="Cargando..."
                    :search="search" no-results-text="No hay resultados" no-data-text="No hay resultados"
                >
                    <template v-slot:top>
                        <v-text-field dense v-model="search" label="Buscar" class="mx-4"/>
                    </template>
                    <template v-slot:item.book="{item}">
                        <div class="d-flex justify-space-between">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on" @click="redirect(item.book.url)">
                                        <v-icon>mdi-download</v-icon>
                                    </v-btn>
                                </template>
                                <span>Descargar</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on" @click="$router.push('/books/' + item.id)">
                                        <v-icon>mdi-eye</v-icon>
                                    </v-btn>
                                </template>
                                <span>Ver</span>
                            </v-tooltip>
                        </div>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Options from "@/models/vue/Options";
import Book from "@/models/Book";
import BookService from "@/services/BookService";

@Component
export default class MyBooksView extends Vue {
    books: Book[] = []
    pageCount: number = 0
    loading: boolean = false
    page: number = 1
    itemsPerPage: number = 20
    totalItems: number = 0
    options: Options = new Options()
    search: string = ""
    headers = [
        { text: "Titulo", value: "title", width: "200px" },
        { text: "Autor", value: "author", width: "200px" },
        { text: "Editorial", value: "editorial", width: "200px" },
        { text: "Lenguaje", value: "language.title", width: "200px" },
        { text: "Libro", value: "book", width: "100px" }
    ]

    refresh() {
        BookService.getMyBooks(this, this.books, this.page - 1, this.itemsPerPage, this.search)
    }

    created() {
        this.refresh()
    }

    redirect(url : string) {
        window.open(url)
    }

}
</script>
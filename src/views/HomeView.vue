<template>
    <div>
        <div class="d-flex flex-column pl-15 search">
            <div class="pt-4 pb-4">
                <h2 style="color: white">Busque sus libros</h2>
            </div>
            <v-container fluid>
                <v-row>
                    <v-col cols="12" sm="10" md="7">
                        <div class="white d-flex align-center" style="height: 64px; border-radius: 5px; padding: 8px 12px;">
                            <v-text-field v-model="search" @keydown.enter="refresh" solo flat label="Buscar" prepend-icon="mdi-magnify" style="height: 48px" light/>
                            <v-select
                                v-model="categoryId" solo flat :items="categories" label="Categorias" prepend-icon="mdi-shape"
                                clearable append-icon="" style="height: 48px" light item-text="title" item-value="id"
                            />
                            <v-btn @click="refresh" class="ml-4 text-capitalize" color="accent" light>Buscar</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <v-container fill-height fluid class="pl-15 pr-15">
            <v-row>
                <v-col cols="12">
                    <v-card class="mb-8" elevation="0" rounded>
                        <v-card-title>
                            Ultimos Libros
                        </v-card-title>
                        <v-card-text>
                            <!--Skeleton Loader-->
                            <v-row v-if="loading">
                                <v-col v-for="(item, i) in 8" :key="i" cols="6" md="3">
                                    <v-skeleton-loader class="mx-auto" min-width="260" height="45vh" type="image@2"/>
                                </v-col>
                            </v-row>
                            <v-data-iterator
                                v-else
                                :items="books" :items-per-page.sync="itemsPerPage" :page="page" :loading="loading"
                                @page-count="pageCount = $event" no-results-text="No hay resultados"
                                no-data-text="No hay resultados" loading-text="Cargando..." hide-default-footer
                            >
                                <template v-slot:default="props">
                                    <v-row>
                                        <v-col v-for="item in props.items" :key="item.id" cols="12" sm="6" md="3" lg="3">
                                            <v-card class="ma-2" elevation="0" @click="$router.replace('/books/' + item.id)" color="customGray">
                                                <v-sheet class="d-flex justify-center align-center" color="primary" height="45vh">
                                                    <v-icon x-large>mdi-book</v-icon>
                                                </v-sheet>
                                                <v-card-actions class="d-flex flex-column">
                                                    <h4 class="text-capitalize">{{ item.title }}</h4>
                                                    <span class="font-weight-bold text-start">
                                                        Autor - <spam class="font-weight-regular text-capitalize">{{ item.author }}</spam>
                                                    </span>
                                                </v-card-actions>
                                            </v-card>
                                        </v-col>
                                    </v-row>
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
                            </v-data-iterator>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import ConstantTool from "@/services/tool/ConstantTool";
import Book from "@/models/Book";
import BookService from "@/services/BookService";
import BookCategory from "@/models/BookCategory";
import BookCategoryService from "@/services/BookCategoryService";

@Component
export default class HomeView extends Vue {
    loading: boolean = false
    projectName: string = ConstantTool.PROJECT_NAME
    page: number = 1
    pageCount: number = 0
    itemsPerPage: number = 30
    search: string = ""
    books: Book[] = []
    categories: BookCategory[] = []
    categoryId!: number

    refresh() {
        BookService.getBooks(this, this.books, this.page - 1, this.itemsPerPage, this.search, this.categoryId)
    }

    created() {
        BookCategoryService.getBookCategories(this, this.categories)
        this.refresh()
    }
}
</script>

<style scoped>
    .search {
        background-color: #663259;
        background-position: right bottom;
        background-size: auto 100%;
        background-repeat: no-repeat;
        height: 179px;
        width: 100%;
        background-image: url('https://preview.keenthemes.com/metronic/theme/html/demo4/dist/assets/media/svg/patterns/taieri.svg')
    }
</style>
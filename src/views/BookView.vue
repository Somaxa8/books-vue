<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <fullscreen :fullscreen.sync="fullscreen">
                    <v-card class="mb-6" height="100%">
                        <v-card-title>
                            <div>{{ book.title }} - {{ book.author }}</div>
                            <v-spacer />
                            <v-btn icon @click="fullscreenToggle">
                                <v-icon>{{ fullscreen ? 'mdi-arrow-collapse' : 'mdi-arrow-expand' }}</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-divider />
                        <v-progress-linear :indeterminate="true" :active="loading"/>
                        <v-card-text>
                            <v-container class="pa-0">
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-card color="primary" class="d-flex justify-center align-center mb-4" height="440" @click="coverMessage">
                                            <v-icon x-large>mdi-image</v-icon>
                                        </v-card>
                                        <v-btn class="mb-4" color="error" block @click="addFavorite">
                                            <v-icon left dark>
                                                mdi-heart
                                            </v-icon>
                                            Añadir a favoritos
                                        </v-btn>
                                        <div class="d-flex flex-column align-center align-md-start">
                                            <spam class="mb-1 info-book">
                                                <b>Titulo:</b> {{ book.title }}
                                            </spam>
                                            <spam class="mb-1 info-book">
                                                <b>Autor:</b> {{ book.author }}
                                            </spam>
                                            <spam class="mb-1 info-book">
                                                <b>Editorial:</b> {{ book.editorial }}
                                            </spam>
                                            <spam class="mb-1 info-book">
                                                <b>Lenguaje:</b> {{ book.language.title }}
                                            </spam>
                                            <spam class="mb-1 info-book">
                                                <b>Extensión: </b>
                                                <v-chip :color="book.book.extension == 'epub' ? 'error' : 'warning'" small label outlined>
                                                    {{book.book.extension.toUpperCase()}}
                                                </v-chip>
                                            </spam>
                                            <spam class="mb-1 info-book">
                                                <b>Categorias:</b>
                                            </spam>
                                            <div>
                                                <v-chip v-for="(category, i) in book.categories" :key="category.id" class="ma-2 ml-0" color="success" outlined>{{category.title}}</v-chip>
                                            </div>
                                            <div v-if="book.description">
                                                <spam>Descripción:</spam>
                                                <p>{{ book.description }}</p>
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="8" class="pt-3" style="min-height: 700px">
                                        <iframe style="border: none; border-radius: 4px" :src="'https://docs.google.com/viewer?url='+ book.book.url +'&embedded=true'" width="100%" height="100%"/>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </fullscreen>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Book from "@/models/Book";
import BookService from "@/services/BookService";

@Component
export default class BookView extends Vue {
    loading: boolean = false
    fullscreen: boolean = false
    book: Book = new Book()


    created() {
        BookService.getBook(this, Number(this.$route.params.bookId))
    }

    addFavorite() {
        BookService.favoriteBook(this, this.book.id!)
    }

    fullscreenToggle() {
        this.fullscreen = !this.fullscreen
    }
}
</script>

<style scoped>
.info-book {
    font-size: 18px;
}
</style>
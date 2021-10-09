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
                                        <v-card v-if="book.cover" class="mb-4">
                                            <v-img :src="book.cover.url" :alt="book.title" height="440"/>
                                        </v-card>
                                        <v-card v-else color="primary" class="d-flex justify-center align-center mb-4" height="440">
                                            <v-icon x-large>mdi-image</v-icon>
                                        </v-card>
                                        <v-btn class="mb-4" color="error" block @click="addFavorite">
                                            <v-icon left dark>
                                                mdi-heart
                                            </v-icon>
                                            Añadir a favoritos
                                        </v-btn>
                                        <div class="d-flex flex-column align-center align-md-start">
                                            <span class="mb-1 info-book">
                                                <b>Titulo:</b> {{ book.title }}
                                            </span>
                                            <span class="mb-1 info-book">
                                                <b>Autor:</b> {{ book.author }}
                                            </span>
                                            <span class="mb-1 info-book">
                                                <b>Editorial:</b> {{ book.editorial }}
                                            </span>
                                            <span class="mb-1 info-book">
                                                <b>Lenguaje:</b> {{ book.language.title }}
                                            </span>
                                            <span class="mb-1 info-book">
                                                <b>Extensión: </b>
                                                <v-chip :color="book.book.extension == 'epub' ? 'error' : 'warning'" small label outlined>
                                                    {{book.book.extension.toUpperCase()}}
                                                </v-chip>
                                            </span>
                                            <span class="mb-1 info-book">
                                                <b>Categorias:</b>
                                            </span>
                                            <div>
                                                <v-chip v-for="(category, i) in book.categories" :key="category.id" class="ma-2 ml-0" color="success" outlined>{{category.title}}</v-chip>
                                            </div>
                                            <div v-if="book.description">
                                                <span>Descripción:</span>
                                                <p>{{ book.description }}</p>
                                            </div>
                                        </div>
                                    </v-col>
<!--                                    <v-col v-if="firstLoading" cols="12" sm="6" md="8" class="pt-3" style="min-height: 700px">-->
<!--                                        <v-skeleton-loader width="100%" height="100%" type="image@4"/>-->
<!--                                    </v-col>-->
                                    <v-col cols="12" sm="6" md="8" class="pt-3" style="min-height: 700px">
                                        <v-card v-if="book.book.extension === 'epub'" light height="100%">
                                            <div class="d-flex justify-space-between">
                                                <v-btn icon @click="prev" class="ma-2">
                                                    <v-icon>mdi-chevron-left</v-icon>
                                                </v-btn>
                                                <v-progress-circular v-if="loading" indeterminate color="primary" class="mt-2"/>
                                                <v-btn icon @click="next" class="ma-2">
                                                    <v-icon>mdi-chevron-right</v-icon>
                                                </v-btn>
                                            </div>
                                            <div ref="epubElement" />
                                        </v-card>
                                        <iframe v-else style="border: none; border-radius: 4px" :src="'https://docs.google.com/viewer?url='+ book.book.url +'&embedded=true'" width="100%" height="100%"/>
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
import {Component, Ref, Vue} from "vue-property-decorator";
import Book from "@/models/Book";
import BookService from "@/services/BookService";
import EPub, {Rendition, Book as BookEpub} from "epubjs";

@Component
export default class BookView extends Vue {
    @Ref() readonly epubElement!: Element
    loading: boolean = false
    firstLoading: boolean = true
    fullscreen: boolean = false
    book: Book = new Book()
    ePub!: BookEpub
    rendition!: Rendition

    async refresh() {
        await BookService.getBook(this, Number(this.$route.params.bookId))
        this.firstLoading = false
        this.ePub = EPub(this.book.book!.url!, {})
        this.rendition = this.ePub.renderTo(this.epubElement, {  width: "100%", height: "600" })
        await this.rendition.display()
    }

    next() {
        this.rendition.next()
    }

    prev() {
        this.rendition.prev()
    }

    created() {
        this.refresh()
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
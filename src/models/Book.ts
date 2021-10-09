import Auditing from "@/models/Auditing";
import {JsonObject, JsonProperty} from "json2typescript";
import {DateTime} from "luxon";
import Document from "@/models/Document";
import DateTimeConverter from "@/services/converters/DateTimeConverter";
import Language from "@/models/Language";
import BookCategory from "@/models/BookCategory";

@JsonObject("Book")
export default class Book extends Auditing {
    @JsonProperty("id", Number, true)
    id?: number = undefined
    @JsonProperty("title", String, true)
    title?: string = undefined
    @JsonProperty("author", String, true)
    author?: string = undefined
    @JsonProperty("editorial", String, true)
    editorial?: string = undefined
    @JsonProperty("description", String, true)
    description?: string = undefined
    @JsonProperty("date", DateTimeConverter, true)
    date?: DateTime = undefined
    @JsonProperty("book", Document, true)
    book?: Document = undefined
    @JsonProperty("cover", Document, true)
    cover?: Document = undefined
    @JsonProperty("language", Language, true)
    language?: Language = undefined

    @JsonProperty("categories", [BookCategory], true)
    categories?: BookCategory[] = undefined
}
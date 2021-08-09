import {JsonObject, JsonProperty} from "json2typescript";

@JsonObject("BookCategory")
export default class BookCategory {
    @JsonProperty("id", Number, true)
    id?: number = undefined
    @JsonProperty("title", String, true)
    title?: string = undefined
}
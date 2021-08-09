import {JsonObject, JsonProperty} from "json2typescript";

@JsonObject("Language")
export default class Language {
    @JsonProperty("id", Number, true)
    id?: number = undefined
    @JsonProperty("title", String, true)
    title?: string = undefined
}
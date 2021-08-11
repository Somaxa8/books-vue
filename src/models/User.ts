import {JsonObject, JsonProperty} from "json2typescript";
import Document from "@/models/Document";

@JsonObject("User")
export default class User {

    @JsonProperty("id", Number, true)
    id?: number = undefined
    @JsonProperty("email", String, true)
    email?: string = undefined
    @JsonProperty("name", String, true)
    name?: string = undefined
    @JsonProperty("lastname", String, true)
    lastname?: string = undefined
    @JsonProperty("avatar", Document, true)
    avatar?: Document = undefined

}
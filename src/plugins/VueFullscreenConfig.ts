import {Vue} from "vue-property-decorator";
import VueFullscreen from "vue-fullscreen";

export default class VueFullscreenConfig {
    static init() {
        Vue.use(VueFullscreen)
    }
}
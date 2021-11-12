<template>
    <SimpleTransition mode="out-in"
        enterAnimation="animate__fadeInRight"
        leaveAnimation="animate__fadeOutRight"
        >
        <PagePreviewScrollbar :isShowCloseButton="false" :isAutoOpacity="false"  :targetSelector="targetSelector" v-if="isActive && isShowPreviewScrollbar" ref="PagePreviewScrollbar" />
    </SimpleTransition>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, watch } from '@vue/composition-api'

    import SimpleTransition from '../util/components/SimpleTransition.vue'

    import $ from 'jquery'
    import { useWindowSize } from 'vue-use-web';
    import { throttle } from 'lodash';

    export default defineComponent({
        name: 'PageScrollbar',
        components:{
            SimpleTransition,
        },
        props:{
            isActive:{
                type: Boolean,
                default: true,
            },
            targetSelector:{
                type: String,
                default: "article.markdown-body"
            }
        },
        setup(props, {refs}){

            const windowSize = useWindowSize({ throttleMs: 50 })
            const isShowPreviewScrollbar = ref(false)
            const HideScrollbar = () => $("html").addClass("hide-scrollbar")
            const ShowScrollbar = () => $("html").removeClass("hide-scrollbar")
            const GetTarget = () => document.querySelector(props.targetSelector) as HTMLElement

            const HandleResize = () => {
                isShowPreviewScrollbar.value = ( GetTarget().getBoundingClientRect().height / 2 ) > windowSize.height.value
                isShowPreviewScrollbar.value ? HideScrollbar() : ShowScrollbar()
            }
            watch( () => [windowSize.width.value, windowSize.height.value], HandleResize )

            const Init = () => {
                HandleResize()
                setTimeout(() => {
                    if(isShowPreviewScrollbar.value){
                        ((refs.PagePreviewScrollbar as any)?.Reset());
                    }
                }, 500)
            }

            const Reset = throttle(Init, 100)
            onMounted(Reset)

            return {
                isShowPreviewScrollbar,
                Reset,
            }
        }        
    })
</script>

<style lang="scss">
    .PagePreviewScrollbar{
        width: 100px !important;
        height: calc( 100vh - 48px ) !important;
        top: unset !important;
        bottom: 0;
        z-index: 4 !important;
    }
</style>
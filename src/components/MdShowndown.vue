<template>
    <article class="MdShowndown markdown-body line-numbers match-braces" v-resize="HandleResize">
        <div class="md-title" v-if="title">{{title}}</div>
        <div v-viewer v-html="contentRef" />
    </article>
</template>

<script lang="ts">
    import { defineComponent, onBeforeUnmount, onMounted, onUpdated, ref, watch } from '@vue/composition-api'

    import { debounce } from 'lodash';
    import $ from 'jquery'
    const showdown = require('showdown');
    const mermaid  = require('mermaid').default;

    import PerfectScrollbar from 'perfect-scrollbar'

    import 'github-markdown-css'
    import 'perfect-scrollbar/css/perfect-scrollbar.css'
    import '@/scss/main.scss'

    // import { GenerateChapter } from '@/util/generateChapter'
    import { Prism, AddDataLine, ChangeLineNumberDomPosition } from '@/util/primsm'

    export default defineComponent({
        name: 'MdShowndown',
        components:{
            
        },
        props:{
            title:{
                type: String,
                default: ""
            },
            content:{
                type: String,
                default: ""
            },
            small:{
                type: Boolean,
                default: false,
            },
        },
        setup(props, {emit}){
            const isComponentActive = ref(true)
            // ==================================================================================
            const converter = new showdown.Converter({
                strikethrough: true,
                tables: true,
                tasklists: true,
                openLinksInNewWindow: true,
            });

            const contentRef = ref("")
            let preScrollbars = [] as Array<PerfectScrollbar>;
            // ==================================================================================
            // Handle Perfect scrollbar
            const SetScrollbar = () => {
                // console.log("SetScrollbar")
                preScrollbars.forEach( x => x.destroy() )
                preScrollbars = []          
                document.querySelectorAll('pre').forEach(function (element) {
                // document.querySelectorAll('pre[class*="language-"]').forEach(function (element) {
                    preScrollbars.push(new PerfectScrollbar(element))
                })
            }

            const UpdatepreScrollbarss = () => {
                preScrollbars.forEach(function (element) {
                    element.update()
                })
            }

            const DestroyScrollbarss = () => {
                preScrollbars.forEach(function (element) {
                    element.destroy()
                })
            }
            // ==================================================================================

            const HandleResize = () => {
                // UpdatepreScrollbarss()
            }

            const Transform = (md: string) => {
                const html = converter.makeHtml(md);
                contentRef.value = html
            }

            // ==================================================================================
            // Update Primsm
            const UpdatePrimsm = debounce(() => {
                if(!isComponentActive.value){
                    // avoid render after component unmounted
                    return
                }
                ChangeLineNumberDomPosition()
                SetScrollbar()
            }, 1000)
            // ==================================================================================
            // init
            onMounted( () => {
                Transform(props.content)
            })
            watch(() => props.content, debounce(() => {
                Transform(props.content)
            }, 500))

            onUpdated(() => {
                // console.log("onUpdated")
                // ==================================================================================
                // GenerateChapter()
                // ==================================================================================
                // Update for mermaid
                mermaid.initialize({
                    startOnLoad: true,
                    theme: 'dark',
                });
                // ==================================================================================
                // Update for prism
                AddDataLine()
                Prism.highlightAll(false, UpdatePrimsm)
                Prism.highlightAll(false, UpdatePrimsm) // force prism to upload code line highlight
                // ==================================================================================
                emit("rendered")
            })
            // ==================================================================================
            onBeforeUnmount(() => {
                isComponentActive.value = false
                DestroyScrollbarss()
            })

            return {
                contentRef,
                HandleResize
            }
        }
    })
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
    
</style>
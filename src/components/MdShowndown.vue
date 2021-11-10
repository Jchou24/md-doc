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
    // ==================================================================================
    // line-highlight
    @mixin code-highkight(){
        .line-highlight{
            background: #0f5298a8;
            border-top: unset;
            border-bottom: unset;
            margin-top: 14px !important;
        }
    }
    .markdown-body{
        @include code-highkight();
        .code-line-highlight{
            z-index: 2;
            width: 3em !important;
        }
    }
    // ==================================================================================
    pre[class*="language-"]{
        border: none;

        code{
            z-index: 1;
        }

        @include code-highkight();

        .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string{
            background: unset;
        }

        .url-link{
            text-decoration: underline;
        }
    }

    pre[class*="language-"]::selection,
    pre[class*="language-"] ::selection,
    code[class*="language-"]::selection,
    code[class*="language-"] ::selection {
        text-shadow: none;
        // background: hsla(0, 0%, 93%, 0.15);
        background: #afcbff57;
    }    
    // ==================================================================================
    // line-number-rows
    .code-line-numbers-bg{
        background: #141414;
        position: absolute;
        left: 0;
        top: 0;
        height: calc( 100% - 15px );
        width: 3em;
        z-index: 1;
        border-radius: 0.5em;

        &:before{
            content: "";
        }
    }

    .line-numbers-rows.code-line-numbers-rows{
        top: 16px;
        left: 0;
        z-index: 3;
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;

        span:before{
            content: counter(linenumber);
        }
    }

    code .line-numbers-rows{
        margin-top: -2px;
        &.reset-code-number > span{
            counter-increment: unset;
        }
    }
</style>
<template>
    <article class="MdIt markdown-body line-numbers match-braces" v-resize="HandleResize">
        <div class="md-title" v-if="title">{{title}}</div>
        <div v-viewer v-html="contentRef" />
    </article>
</template>

<script lang="ts">
    import { defineComponent, onBeforeUnmount, onMounted, onUpdated, ref, watch } from '@vue/composition-api'

    import { debounce } from 'lodash';
    import $ from 'jquery'
    
    const mermaid  = require('mermaid').default;

    import PerfectScrollbar from 'perfect-scrollbar'

    import 'katex/dist/katex.min.css'
    import 'github-markdown-css'
    import 'perfect-scrollbar/css/perfect-scrollbar.css'
    import '@/scss/main.scss'

    // import { GenerateChapter } from '@/util/generateChapter'
    import { Prism, AddDataLine, ChangeLineNumberDomPosition } from '@/util/primsm'
    import { ScrollToHash } from '@/util/scroller';

    export default defineComponent({
        name: 'MdIt',
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
            const md = require('markdown-it')({
                html:         true,        // Enable HTML tags in source
                xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                                            // This is only for full CommonMark compatibility.
                breaks:       false,        // Convert '\n' in paragraphs into <br>
                langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                                            // useful for external highlighters.
                linkify:      true,        // Autoconvert URL-like text to links

                // Enable some language-neutral replacement + quotes beautification
                // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
                typographer:  false,

                // Double + single quotes replacement pairs, when typographer enabled,
                // and smartquotes on. Could be either a String or an Array.
                //
                // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
                // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
                // quotes: '“”‘’',

                // Highlighter function. Should return escaped HTML,
                // or '' if the source string is not changed and should be escaped externally.
                // If result starts with <pre... internal wrapper is skipped.
                highlight: function (/*str, lang*/) { return ''; }
            });

            // ==================================================================================
            md.use(require('@iktakahiro/markdown-it-katex'))
            md.use(require('markdown-it-sub'))
                // https://www.npmjs.com/package/markdown-it-sub
                // https://github.com/markdown-it/markdown-it-sub
            md.use(require('markdown-it-sup'))
                // https://www.npmjs.com/package/markdown-it-sup
                // https://github.com/markdown-it/markdown-it-sup
            md.use(require('markdown-it-task-lists'), {label: true, labelAfter: true})
                // https://www.npmjs.com/package/markdown-it-task-lists
                // https://github.com/revin/markdown-it-task-lists
            md.use(require('markdown-it-mark'))
                // https://www.npmjs.com/package/markdown-it-mark
                // https://github.com/markdown-it/markdown-it-mark
            md.use(require('markdown-it-footnote'))
                // https://www.npmjs.com/package/markdown-it-footnote
                // https://github.com/markdown-it/markdown-it-footnote
            md.use(require('markdown-it-multimd-table'), {
                multiline:  true,
                rowspan:    true,
                headerless: false,
            });
                // https://www.npmjs.com/package/markdown-it-multimd-table
            // ==================================================================================
            // for charts
            // ==================================================================================
            md.use(require('markdown-it-mermaid').default)
                // https://www.npmjs.com/package/markdown-it-mermaid
                // https://github.com/tylingsoft/markdown-it-mermaid
            md.use(require('markdown-it-plantuml'))
                // https://www.npmjs.com/package/markdown-it-plantuml?activeTab=readme
                // https://github.com/gmunguia/markdown-it-plantuml
            // ==================================================================================
            // for video
            // ==================================================================================
            md.use(require('@centerforopenscience/markdown-it-video'))
                // hhttps://www.npmjs.com/package/@centerforopenscience/markdown-it-video
                // https://github.com/CenterForOpenScience/markdown-it-video
                
                // require('markdown-it-video', { 
                //     youtube: { width: 640, height: 390 },
                //     vimeo: { width: 500, height: 281 },
                //     vine: { width: 600, height: 600, embed: 'simple' },
                //     prezi: { width: 550, height: 400 }
                //   }

            md.use(require('markdown-it-html5-embed'),{
                    html5embed: { // no setting will cause null error
                        useImageSyntax: true, // Enables video/audio embed with ![]() syntax (default)
                        // useLinkSyntax: true   // Enables video/audio embed with []() syntax
                    }
                })
                // https://www.npmjs.com/package/markdown-it-html5-embed
                // https://github.com/cmrd-senya/markdown-it-html5-embed

            md.use(require('markdown-it-iframe'))
                // https://www.npmjs.com/package/markdown-it-iframe
                // https://github.com/rjriel/markdown-it-iframe
            // ==================================================================================
            const converter = md
            const contentRef = ref("")
            let preScrollbars = [] as Array<PerfectScrollbar>;
            // ==================================================================================
            // Handle Perfect scrollbar

            const DestroyScrollbarss = () => preScrollbars.forEach( x => x.destroy() )
            const SetScrollbar = () => {
                // console.log("SetScrollbar")
                DestroyScrollbarss()
                preScrollbars = []
                for(let selector of ['pre', 'table']){
                    document.querySelectorAll(selector).forEach(function (element) {
                    // document.querySelectorAll('pre[class*="language-"]').forEach(function (element) {
                        preScrollbars.push(new PerfectScrollbar(element))
                    })
                }
            }

            const UpdatepreScrollbarss = () => {
                preScrollbars.forEach(function (element) {
                    element.update()
                })
            }
            // ==================================================================================
            const HandleResize = () => {
                // UpdatepreScrollbarss()
            }

            const Transform = (md: string) => {
                md = md.replaceAll("&gt;", ">")
                md = md.replaceAll("&lt;", "<")
                const html = converter.render(md);
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

                mermaid.initialize({
                    startOnLoad: true,
                    theme: 'neutral',
                });
            })
            watch(() => props.content, debounce(() => {
                Transform(props.content)
            }, 500))

            onUpdated(() => {
                // console.log("onUpdated")
                // ==================================================================================
                const OnAnchorClick = (e: Event) => {
                    ScrollToHash($("html, body")[0], (e.target as HTMLAnchorElement).hash, 60)
                }
                $("a[href^='#']").on('click', OnAnchorClick )
                // ==================================================================================
                // GenerateChapter()
                // ==================================================================================
                // Update for mermaid
                mermaid.init()
                // ==================================================================================
                // Update for prism
                AddDataLine()
                Prism.highlightAll(false, UpdatePrimsm)
                Prism.highlightAll(false, UpdatePrimsm) // force prism to upload code line highlight
                // ==================================================================================
                SetScrollbar()
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
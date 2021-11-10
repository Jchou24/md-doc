<template>
    <SimpleTransition mode="out-in"
        enterAnimation="animate__fadeInLeft"
        leaveAnimation="animate__fadeOutLeft"
        >
        <v-card class="SidebarTOC round-border ma-1" v-if="toc.length > 0" >
            <v-sheet class="pa-2 primary d-flex justify-center text-h6 white-color">
                <v-icon class="ml-n5 mr-1 white-color">
                    mdi-view-list
                </v-icon>
                Outline
            </v-sheet>
            <v-list class="pa-2 round-border" dense >
                <v-list-item-group
                    v-model="selectedHeader"
                    color="primary"
                    mandatory
                    >
                    <RippleTransitionFlip :setNumber="10">
                        <v-list-item class="round-border"
                            v-for="(item, idx) in toc"
                                :key="idx" :data-index="idx"
                                :class="[item.tag]"
                                href2="`#${item.id}`"
                                @click="ScrollToHeader(idx)"
                            >
                            <v-list-item-content>
                                <v-list-item-title v-text="`${item.chaptor} ${item.title}`" />
                            </v-list-item-content>
                        </v-list-item>
                    </RippleTransitionFlip>
                </v-list-item-group>
            </v-list>
        </v-card>
    </SimpleTransition>
</template>

<script lang="ts">
    import { defineComponent, onBeforeUnmount, onMounted, ref } from '@vue/composition-api'

    import RippleTransitionFlip from '../util/components/RippleTransitionFlip.vue'
    import SimpleTransition from '../util/components/SimpleTransition.vue'

    import $ from 'jquery'
    import throttle from 'lodash.throttle'
    import { TOCTree, IHeaderInfo } from '@/util/toc'
    import { ScrollTo } from '@/util/scroller'

    export default defineComponent({
        name: 'SidebarTOC',
        components:{
            RippleTransitionFlip,
            SimpleTransition,
        },
        props:{
            targetSelector:{
                tpye: String,
                default: "article"
            }
        },
        setup(props){
            const selectedHeader = ref(0)
            const tocTree = ref(undefined as TOCTree | undefined)
            const toc = ref([] as Array<IHeaderInfo>)

            const Init = () => {
                tocTree.value = new TOCTree(props.targetSelector, true)
                toc.value = tocTree.value.Fit()

                RemoveAnchorEvent()
                AddAnchorEvent()
            }
            // ==================================================================================
            // scroll article
            const GetContainer = () => "body, html"
            const GetPositionTop = (idx: number) => document.getElementById(`${toc.value[idx].id}`)?.getBoundingClientRect().top as number
            const GetWrapperTop = () => document.getElementsByClassName("markdown-body")[0].getBoundingClientRect().top as number
            const GetCurrentPosition = () => $("html, body").scrollTop() as number
            const ScrollToHeader = (tocIdx: number) => {
                selectedHeader.value = tocIdx
                ScrollTo( GetContainer(), GetPositionTop(tocIdx) - GetWrapperTop() - 20, GetCurrentPosition() )
            }
            // ==================================================================================
            // scroll sidebar toc item
            const baseline = 48
            const GetDistances = () => {
                let distances = []
                for( let i = 0; i < toc.value.length; i++ ){
                    distances.push({
                        distance: GetPositionTop(i) - baseline,
                        idx: i
                    })
                }
                distances = distances.filter( x => x.distance > 0 )
                return distances
            }

            const GetCurrentHeaderIdx = () => {
                const distances = GetDistances()
                if( distances.length === 0 ){
                    return toc.value.length - 1
                }
                const current = distances.reduce( (prev, curr) => prev.distance < curr.distance ? prev : curr )
                return current.idx
            }

            const HandleArticleScroll = () => selectedHeader.value = GetCurrentHeaderIdx()
            const HandleArticleScrollThrottle = throttle(HandleArticleScroll, 300)
            // ==================================================================================
            // modify anchor click event
            const SearchScrollToHash = (delay=0, hash: string) => {
                hash = hash || window.location.hash
                if( hash ){
                    setTimeout(function(){
                        if( !(hash && toc.value) ){
                            return
                        }

                        if( $(hash).length == 0 ){
                            return
                        }

                        const tmp = hash.split("-")
                        if(tmp.length == 2){
                            // history.pushState({}, "", window.location.href);
                            ScrollToHeader( parseInt(tmp[1]) )
                        }
                    }, delay)
                    return true
                }else{
                    return false
                }
            }

            const HandleAnchorClick = (e: Event ) => {
                // console.log("HandleAnchorClick")
                e.preventDefault()
                SearchScrollToHash(0, (e.target as HTMLAnchorElement).hash)
            }

            const AddAnchorEvent = () => 
                document.querySelectorAll(`${props.targetSelector} a[href*='#toc-']`).forEach( el => el.addEventListener('click', HandleAnchorClick) )
            const RemoveAnchorEvent = () => 
                document.querySelectorAll(`${props.targetSelector} a[href*='#toc-']`).forEach( el => el.removeEventListener('click', HandleAnchorClick) )
            // ==================================================================================
            // Init
            onMounted( () => {
                // console.log("onMounted")
                Init()
                $( window ).on("scroll", HandleArticleScrollThrottle)
                SearchScrollToHash(0,"")
            })
            onBeforeUnmount( () => {
                // console.log("onBeforeUnmount")
                $( window ).off("scroll", HandleArticleScrollThrottle)
                RemoveAnchorEvent()
            })
            
            return {
                selectedHeader,
                toc,
                Init,
                ScrollToHeader,
            }
        }        
    })
</script>

<style lang="scss" scoped>
    .SidebarTOC{
        // background: brown;
    }

    .white-color{
        color: white
    }
</style>

<style lang="scss">
    .SidebarTOC .v-list-item{
        &.h2{
            padding-left: 25px;
        }

        &.h3,
        &.h4,
        &.h5,
        &.h6{
            padding-left: 45px;
        }
    }

    .theme--light.v-list-item:hover::before,
    .theme--light.v-list-item--active:hover::before, 
    .theme--light.v-list-item--active::before {
        border-radius: 15px !important;
    }
</style>



<template>
    <v-app :class="{
        'small': isSizeSm,
        'activeSidebar': isActiveSidebar,
        'is-parallax': isParallax,
    }">
        <Nav :appMode.sync="appMode" :isActiveSidebar.sync="isActiveSidebar" :small="isSizeSm" 
            :contents="contents" :selectedItem="selectedItem" :mdOptions="mdOptions"/>
        <SimpleTransition leaveAnimation="animate__fadeOutLeft">
            <Sidebar :appMode="appMode" :isActive.sync="isActiveSidebar" :small="isSizeSm"
                :contents="contents" :selectedItem.sync="selectedItem"
                ref="Sidebar"
                v-show="appMode == AppMode.viewer || appMode == AppMode.readme"/>
        </SimpleTransition>

        <v-main>
            <SimpleTransition mode="out-in">
                <MdViewer class="md-viewer" :title="title" :content="content" :small="isSizeSm" :isActiveSidebar="isActiveSidebar"
                    @rendered="HandleRendered"
                    v-if="appMode == AppMode.viewer"/>

                <MdEditor class="md-editor" :content.sync="content" :small="isSizeSm"
                     @rendered="HandleRendered"
                    v-if="appMode == AppMode.editor"/>

                <MdExample class="md-example" :small="isSizeSm"
                     @rendered="HandleRendered"
                    v-if="appMode == AppMode.example"/>

                <Readme class="readme" :small="isSizeSm" :isActiveSidebar="isActiveSidebar"
                    @rendered="HandleRendered"
                    v-if="appMode == AppMode.readme"/>
            </SimpleTransition>
        </v-main>

        <PageScrollbar :isActive="!isSizeSm" v-if="isShowPageScrollbar" ref="PageScrollbar" />
    </v-app>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, watch } from '@vue/composition-api'

    import PageScrollbar from '@/components/PageScrollbar.vue'
    import SimpleTransition from '@/util/components/SimpleTransition.vue'
    import Nav from '@/components/Nav.vue'
    import Sidebar from '@/components/Sidebar.vue'
    import MdViewer from '@/views/MdViewer.vue'
    import MdEditor from '@/views/MdEditor.vue'
    import MdExample from '@/views/MdExample.vue'
    import Readme from '@/views/Readme.vue'

    import { useWindowSize } from 'vue-use-web';
    import { provideToast, useToast } from "vue-toastification/composition";
    import { POSITION } from "vue-toastification";
    import "vue-toastification/dist/index.css";
    import { AppMode } from '@/models/appMode'
    import { IMdOptions } from '@/models/mdOptions'
    import { ScrollTop, StopScrollingWhenUserActive } from '@/util/scroller'
    import { GetMapperTreeId2MdId, GetMdTree, LoadMd } from '@/util/mdLoader'

    export default defineComponent({
        name: 'App',
        components:{
            PageScrollbar,
            SimpleTransition,
            Nav,
            Sidebar,
            MdViewer,
            MdEditor,
            MdExample,
            Readme,
        },
        setup(props, {refs, root}){
            const mdOptions = ref( (root as any).opts as IMdOptions )
            const appMode = ref( AppMode.viewer )
            // ==================================================================================
            const contents = ref(LoadMd());
            const mdTree = computed( () => GetMdTree(contents.value) )
            const mapperTreeId2MdId = computed( () => GetMapperTreeId2MdId(mdTree.value))
            const selectedItem = ref(mapperTreeId2MdId.value[0])
            const content = ref("")
            const title = computed( () => contents.value[selectedItem.value]?.title || "" )
            const SetContent = () => content.value = contents.value[selectedItem.value].md
            const SetContents = () => contents.value[selectedItem.value].md = content.value
            watch(selectedItem, SetContent )
            watch(content, SetContents )
            SetContent()
            // ==================================================================================
            StopScrollingWhenUserActive()
            const HandleRendered = () => {
                (refs.Sidebar as any)?.Init();
                (refs.PageScrollbar as any)?.Reset();
            }
            // ==================================================================================
            const isActiveSidebar = ref(true)
            const { width, height } = useWindowSize()
            const isSizeSm = computed( () => width.value <= 600 )
            const UpdateIsSizeSm = () => isSizeSm.value ? isActiveSidebar.value = false : isActiveSidebar.value = true
            watch(isSizeSm, UpdateIsSizeSm )
            UpdateIsSizeSm()
            // ==================================================================================
            const isShowPageScrollbar = ref(false)
            setTimeout(() => {
                isShowPageScrollbar.value = true
            }, 3000)
            // ==================================================================================
            const UpdateRootClassSize = () => {
                isSizeSm.value ? document.documentElement.classList.add("small") : document.documentElement.classList.remove("small")
            }
            UpdateRootClassSize()
            watch(isSizeSm, UpdateRootClassSize )
            // ==================================================================================
            const isParallax = computed( () => isActiveSidebar.value && isSizeSm.value )
            // ==================================================================================
            // const position = computed( () => isSizeSm.value ? POSITION.BOTTOM_CENTER : POSITION.TOP_RIGHT )
            provideToast({
                position: POSITION.BOTTOM_CENTER,
                toastClassName: "toast-notification",
                transition: "Vue-Toastification__fade",
                draggable: true,
                closeOnClick: false,
                filterBeforeCreate: (toast, toasts) => {
                    if (toasts.filter(
                        t => t.type === toast.type
                    ).length !== 0) {
                        // Returning false discards the toast
                        return false;
                    }
                    // You can modify the toast if you want
                    return toast;
                }
            })
            const toast = useToast()
            watch(appMode, () => {
                switch(appMode.value){
                    case AppMode.editor:
                        toast.warning("This is a tmp editor mode. The changes will not be saved!", {
                            // position: position.value,
                            // timeout: false
                        })
                        break
                    case AppMode.example:
                        toast.info("Welcome to markdown example editor.", {
                            // position: position.value,
                            // timeout: false
                        })
                        break
                    default:
                        break
                }
            })
            // ==================================================================================
            watch(() => [appMode.value, selectedItem.value], ScrollTop)
            // ==================================================================================
            const UpdateRootClassAppMode = (newValue: AppMode, oldValue: AppMode) => {
                document.documentElement.classList.remove(AppMode[oldValue])
                document.documentElement.classList.add(AppMode[newValue])
            }
            UpdateRootClassAppMode(appMode.value, appMode.value)
            watch(appMode, UpdateRootClassAppMode)

            return {
                mdOptions,
                appMode,
                // ==============================
                title,
                content,
                contents,
                selectedItem,
                // ==============================
                isSizeSm,
                isActiveSidebar,
                isShowPageScrollbar,
                isParallax,
                AppMode,
                HandleRendered,
            }
        }
    })
</script>

<style lang="scss">
    #article,
    section.article {
        display: none;
    }
    // ==================================================================================
    html {        
        // -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar
        {
            width: 12px;
            height: 8px;
            background-color: #eaeaea;
        }
    
        &::-webkit-scrollbar-thumb
        {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
            background-color: #d8d8d8;

            &:hover{
                background-color: #ecebeb;
            }
        }

        &.hide-scrollbar{
            &::-webkit-scrollbar,
            &::-webkit-scrollbar-thumb { 
                width: 0px;
                display: none; 
            }
        }
        
        // &.viewer,
        // &.readme{
        //     @media (min-width: 600px) { 
        //         &::-webkit-scrollbar,
        //         &::-webkit-scrollbar-thumb { 
        //             width: 0px;
        //             display: none; 
        //         }
        //     }
        // }
    }
    // ==================================================================================
    .v-application{
        transition: transform 0.4s;
        &.is-parallax .v-main{
            transform: translate(40px, 10px);
        }
        
        .Sidebar-content.v-navigation-drawer{
            transition-duration: 0.4s;
            transition-property: transform,visibility,width,opacity;
            transition-timing-function: ease;
            &.v-navigation-drawer--close{
                opacity: 0.3;
                transform: translateX(-100%) translateY(-40px) !important;
            }
        }
    }
    // ==================================================================================
    $width-sidebar: 300px;
    $width-scrollbar: 100px;
    $width-article: calc( 100vw - #{$width-sidebar} - #{$width-scrollbar} );

    .hidden-sideblock{
        height: calc( 100vh - 48px );
        // background: brown;
        display: block;
    }

    .md-viewer .sidebar-bg{
        width: $width-sidebar;
    }

    .md-viewer .article{
        width: $width-article;
        flex-grow: 1;
    }

    .md-viewer .scrollbar-bg{
        width: $width-scrollbar;
    }
    // ==================================================================================
    .active-page-scrollbar{
        .md-editor,
        .md-example{
            padding-right: $width-scrollbar;
        }
    }
    // ==================================================================================
    .Vue-Toastification__container{
        padding-top: 68px;

        .toast-notification{
            padding: 8px 16px;
            width: 400px;
        }

        @media only screen and (max-width: 600px){
            .toast-notification{
                border-radius: 15px;
                margin: 0 auto;
                margin-bottom: 8px;
                width: 90%;
                max-width: 400px;
                min-height: 46px;
                padding: 2px 6px;
                padding-left: 12px;
            }

            .Vue-Toastification__toast-body{
                font-size: 14px;
                line-height: 1.5;
            }

            .Vue-Toastification__icon{
                margin-right: 12px;
            }
        }

        .Vue-Toastification__toast--info{
            background-color: #1290de;
            background: linear-gradient(135deg, #0e4597 15%, #1290de 76%, #0e4597 80%);
        }

        .Vue-Toastification__toast--success {
            background-color: #4caf50;
            background: linear-gradient(135deg, #0f6d46 15%, #29c483 76%, #0f6d46 80%);
        }

        .Vue-Toastification__toast--warning{
            background-color: orange;
            background: linear-gradient(135deg, #d76402 15%, #ffa500 76%, #d76402 80%);
        }

        .Vue-Toastification__toast--error {
            background-color: #ff5252;
            background: linear-gradient(135deg, #b63b3b 15%, #ff5252 76%, #b63b3b 80%);
        }

        .Vue-Toastification__toast-body,
        .toast-notification{
            display: flex;
            align-items: center;
        }

        .Vue-Toastification__close-button{
            background: #ffffff60;
            border-radius: 100%;
            height: 24px;
            width: 24px;
            padding-left: 4px;
            padding-right: 4px;
            margin-left: 14px;
            opacity: 1;
            transition-property: visibility, opacity, background;
            transition: visibility 0s, opacity 0.2s linear, background 0.2s linear;

            &:hover{
                background: #ffffff91;
            }
        }
    }
</style>
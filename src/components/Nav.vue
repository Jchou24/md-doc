<template>
    <SimpleTransition mode="out-in" speed="animate__faster"
        enterAnimation="animate__fadeInDown"
        leaveAnimation="animate__fadeOutUp"
        >
        <v-app-bar class="Nav gradient-bg" :class="{small}"
            app
            color="primary"
            dark
            dense
            v-resize="HandleNavResize"
            v-show="isShowNav"
        >
            <div class="left-btns d-flex align-center">
                <v-app-bar-nav-icon @click="HandleToggleSidebar" v-if="small" :disabled="isDisabledAppBarIcon" />

                <NavBtn
                    :currentAppMode="appMode" :btnAppMode="AppMode.editor" :small="small" smallHideText
                    icon="mdi-square-edit-outline"
                    btnText="Editor"
                    @click="ChangeEditMode"
                    />

                
                <NavBtn class="title-btn" 
                    :currentAppMode="appMode" :btnAppMode="AppMode.viewer" :small="small"
                    icon="mdi-file"
                    btnText=""
                    @click="ChangeViewMode"
                    >
                    <OverflowElement>
                        {{currentTitle}}
                    </OverflowElement>
                </NavBtn>
            </div>

            <div class="d-flex align-center">
                <NavBtn
                    :currentAppMode="appMode" :btnAppMode="AppMode.example" :small="small" smallHideText
                    icon="mdi-code-greater-than"
                    btnText="Example"
                    @click="ChangeExampleMode"
                    />

                <NavBtn
                    :currentAppMode="appMode" :btnAppMode="AppMode.readme" :small="small" smallHideText
                    icon="mdi-information-outline"
                    btnText="Readme"
                    @click="ChangeReadmeMode"
                    />

                <NavThemeBtn :theme="theme" class="theme-btn mx-n3" />
            </div>
        </v-app-bar>
    </SimpleTransition>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from '@vue/composition-api'

    import SimpleTransition from '../util/components/SimpleTransition.vue'
    import OverflowElement from '@/util/components/OverflowElement.vue'
    import NavBtn from './NavBtn.vue'
    import NavThemeBtn from './NavThemeBtn.vue'

    import { HandleWindowScrollDirection } from '@/util/scroller';
    import { AppMode } from '@/models/appMode'
    import { IMdData } from '@/models/mdData'
    import { IMdOptions } from '@/models/mdOptions'
    import { Themes } from '@/models/constant/theme'

    export default defineComponent({
        name: 'Nav',
        components:{
            SimpleTransition,
            OverflowElement,
            NavBtn,
            NavThemeBtn,
        },
        props:{
            mdOptions:{
                type: Object as PropType<IMdOptions>,
                required: true,
            },
            appMode:{
                type: Number as PropType<AppMode>,
                required: true,
            },
            isActiveSidebar:{
                type: Boolean,
                default: true,
            },
            small:{
                type: Boolean,
                default: false,
            },
            contents:{
                type: Array as PropType<Array<IMdData>>,
                required: true,
            },
            selectedItem:{
                type: Number,
                required: true,
            },
        },
        setup(props, {emit}){
            const appModeRef = computed({
                get: () => props.appMode as AppMode,
                set: (value: AppMode) => emit("update:appMode", value)
            })

            const isActiveSidebarRef = computed({
                get: () => props.isActiveSidebar as boolean,
                set: (value: boolean) => emit("update:isActiveSidebar", value)
            })

            const isDisabledAppBarIcon = computed( () => 
                appModeRef.value === AppMode.editor ||
                appModeRef.value === AppMode.example)

            const ChangeViewMode = () => appModeRef.value = AppMode.viewer
            const ChangeEditMode = () => appModeRef.value = AppMode.editor
            const ChangeExampleMode = () => appModeRef.value = AppMode.example
            const ChangeReadmeMode = () => appModeRef.value = AppMode.readme
            const HandleToggleSidebar = () => isActiveSidebarRef.value = !isActiveSidebarRef.value
            const currentTitle = computed( () => props.contents[props.selectedItem].title )

            // ==================================================================================
            const isShowNav = ref(true)
            const HandleScrollDirection = (isScrollDown: boolean) => {
                if (!props.small) {
                    isShowNav.value = true
                    return
                }

                if (props.isActiveSidebar) {
                    isShowNav.value = true
                    return
                }

                isShowNav.value = !isScrollDown
            }
            HandleWindowScrollDirection(HandleScrollDirection)
            HandleScrollDirection(false)
            // ==================================================================================
            const theme = computed( () => {
                switch (props.mdOptions.theme) {
                    case "blue":
                        return Themes.blue
                    case "green":
                        return Themes.green             
                    case "default":
                    default:
                        return Themes.default
                }
            })

            return {
                appModeRef,
                currentTitle,
                isShowNav,
                isDisabledAppBarIcon,
                theme,
                AppMode,
                ChangeViewMode,
                ChangeEditMode,
                ChangeExampleMode,
                ChangeReadmeMode,
                HandleToggleSidebar,
                HandleNavResize: () => HandleScrollDirection(false),
            }
        }        
    })
</script>

<style lang="scss" scoped>
    .v-app-bar.v-app-bar--fixed.Nav{
        z-index: 10;
    }

    .v-btn{
        text-transform: unset;
    }

    .v-btn.active{
        $hover-width: 6px;
        $color-hover: #83b8e9;
        text-shadow: 
            0px 0px $hover-width $color-hover, 
            0px 0px $hover-width $color-hover, 
            0px 0px $hover-width $color-hover, 
            0px 0px $hover-width $color-hover, 
            0px 0px $hover-width $color-hover, 
            0px 0px $hover-width $color-hover, 
            0px 0px $hover-width $color-hover;
        font-weight: bold;
        border-bottom: 3px solid rgb(218, 233, 252);
        margin-bottom: -3px;
        height: 33px !important;
    }

    .Nav{
        width: 100vw;
    }
</style>

<style lang="scss">
    .Nav.small .v-toolbar__content{
        padding-left: 0px !important;
        padding-right: 4px !important;
        .v-app-bar__nav-icon{
            width: 32px !important;
            margin-right: -4px;
        }

        .theme-btn .v-btn{
            width: 32px !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
        }
    }

    .Nav .v-toolbar__content{
        justify-content: space-between;

        .left-btns{
            flex-grow: 1;
        }

        .title-btn{
            flex-shrink: 1;
            padding-right: 6px !important;
            .v-btn__content{
                display: grid;
                width: 100%;
                height: 100%;
                .OverflowElement{
                    padding-left: 20px;
                }
            }

            .v-icon{
                position: absolute !important;
                left: 0px;
            }
        }
    }
</style>
<template>
    <v-card class="Sidebar"
        elevation="12"
        width="300px"
        ref="Sidebar"
        >
        <v-navigation-drawer v-model="isActiveRef" class="Sidebar-content pa-2"
            width="300px"
            fixed floating :touchless="small"
            :permanent="isActiveRef && !small"
            :temporary="small"
        >
            <SimpleTransition mode="out-in"
                enterAnimation="animate__fadeInLeft"
                leaveAnimation="animate__fadeOutLeft"
                >
                <!-- <SidebarTabs class="mb-3" :contents="contents" :selectedItem.sync="selectedItemRef" /> -->
                <SidebarTabsAdvance class="mb-3" :contents="contents" :selectedItem.sync="selectedItemRef" 
                    v-show="appMode === AppMode.viewer" />
            </SimpleTransition>
            <SidebarTOC ref="SidebarTOC" />
        </v-navigation-drawer>
    </v-card>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, PropType, ref } from '@vue/composition-api'

    import SimpleTransition from '../util/components/SimpleTransition.vue'
    import SidebarTabs from './SidebarTabs.vue'
    import SidebarTabsAdvance from './SidebarTabsAdvance.vue'
    import SidebarTOC from './SidebarTOC.vue'

    import PerfectScrollbar from 'perfect-scrollbar'
    import 'perfect-scrollbar/css/perfect-scrollbar.css'
    import { IMdData } from '@/models/mdData'
    import { AppMode } from '@/models/appMode'

    export default defineComponent({
        name: 'Sidebar',
        components:{
            SimpleTransition,
            SidebarTabs,
            SidebarTabsAdvance,
            SidebarTOC,
        },
        props:{
            appMode:{
                type: Number as PropType<AppMode>,
                required: true,
            },
            isActive:{
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
        setup(props, {refs, emit}){
            const Init = () => (refs.SidebarTOC as any).Init()
            onMounted(() => {
                // const el = ((refs.Sidebar as any).$el as HTMLElement).querySelector(".v-navigation-drawer__content") as HTMLElement
                // new PerfectScrollbar(el)
            })

            const selectedItemRef = computed({
                get: () => props.selectedItem,
                set: (value: number) => emit("update:selectedItem", value)
            })

            const isActiveRef = computed({
                get: () => props.isActive,
                set: (value) => emit("update:isActive", value)
            })

            return {
                selectedItemRef,
                isActiveRef,
                Init, 
                AppMode,
            }
        }        
    })
</script>

<style lang="scss" scoped>
    .Sidebar-content{
        margin-top: 48px;
        height: calc( 100vh - 48px ) !important;
        background-color: unset !important;
        background: unset !important;
        box-shadow: unset !important;
    }
</style>

<style lang="scss">
    .Sidebar .v-navigation-drawer__content{
        position: relative;
        &::-webkit-scrollbar
        {
            display: none;
        }
    
        &::-webkit-scrollbar-thumb
        {
            display: none;
        }
    }

    .round-border{
        border-radius: 15px !important;
    }
</style>


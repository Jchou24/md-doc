<template>
    <div class="MdViewer layout d-flex flex-row">
        <div class="sidebar-bg hidden-sideblock" v-if="!small && isActiveSidebar" />
        <MdRenderer :title="title" :content="content" :small="small" @rendered="HandleRendered" />
        <div class="scrollbar-bg hidden-sideblock" v-if="!small"/>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api'
    
    import MdRenderer from '@/components/MdRenderer.vue'

    export default defineComponent({
        name: 'MdViewer',
        components:{
            MdRenderer
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
            isActiveSidebar:{
                type: Boolean,
                default: false,
            },
        },
        setup(props, {emit}){
            return {
                HandleRendered: () => emit("rendered")
            }
        }        
    })
</script>

<style lang="scss" scoped>

</style>
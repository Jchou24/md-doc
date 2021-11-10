<template>
    <div class="Readme layout d-flex flex-row">
        <MdViewer class="md-viewer" title="Markdown Document" :content="content" :small="small" :isActiveSidebar="isActiveSidebar"
            @rendered="HandleRendered"
            />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api'
    
    import MdViewer from '@/views/MdViewer.vue'

    import { readme } from '@/models/constant/readme'

    export default defineComponent({
        name: 'Readme',
        components:{
            MdViewer
        },
        props:{
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
                HandleRendered: () => emit("rendered"),
                content: readme,
            }
        }        
    })
</script>

<style lang="scss" scoped>
    .md-viewer{
        width: 100%;
    }
</style>
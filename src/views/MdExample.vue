<template>
    <MdEditor class="MdExample md-editor" :content.sync="content" :small="small"  @rendered="HandleRendered"/>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api'

    import MdEditor from '@/views/MdEditor.vue'

    import { mdExample } from '@/models/constant/mdExample'

    export default defineComponent({
        name: 'MdExample',
        components:{
            MdEditor,
        },
        props:{
            small:{
                type: Boolean,
                default: false,
            },
        },
        setup(props, {emit}){
            const content = ref(mdExample)

            return {
                content,
                HandleRendered: () => emit("rendered"),
            }
        }        
    })
</script>

<style lang="scss" scoped>

</style>
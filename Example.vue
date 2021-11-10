<template>
    <div class="Example">
        
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api'

    export default defineComponent({
        name: 'Example',
        components:{
            
        },
        props:{

        },
        setup(){
            const data = ref("AAA")
            return {
                data
            }
        }        
    })
</script>

<style lang="scss" scoped>

</style>
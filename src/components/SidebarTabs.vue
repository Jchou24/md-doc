<template>
    <v-card class="SidebarTabs round-border ma-1" >
        <v-list class="pa-2 round-border" dense >
            <v-list-item-group
                v-model="selectedItemRef"
                color="primary"
                mandatory
                >
                <RippleTransitionFlip :setNumber="10">
                    <v-list-item class="round-border"
                        v-for="(content, idx) in contents"
                            :key="idx" :data-index="idx"
                        >
                        <v-list-item-content>
                            <v-list-item-title v-text="`${idx+1} ${content.title}`" />
                        </v-list-item-content>
                    </v-list-item>
                </RippleTransitionFlip>
            </v-list-item-group>
        </v-list>
    </v-card>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, computed } from '@vue/composition-api'

    import RippleTransitionFlip from '../util/components/RippleTransitionFlip.vue'

    import { IMdData } from '@/models/mdData'

    export default defineComponent({
        name: 'SidebarTabs',
        components:{
            RippleTransitionFlip
        },
        props:{
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
            const selectedItemRef = computed({
                get: () => props.selectedItem,
                set: (value: number) => emit("update:selectedItem", value)
            })

            return {
                selectedItemRef,
            }
        }        
    })
</script>

<style lang="scss" scoped>

</style>
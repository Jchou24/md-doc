<template>
    <SimpleTransition mode="out-in"
        enterAnimation="animate__fadeInLeft"
        leaveAnimation="animate__fadeOutLeft"
        >
        <v-card class="SidebarTabsAdvance round-border ma-1" v-if="contents.length > 0">
            <v-sheet class="pa-2 primary">
                <v-text-field rounded dense small 
                    v-model="search"
                    label="Search Document"
                    dark
                    flat
                    solo-inverted
                    hide-details
                    clearable
                    clear-icon="mdi-close-circle-outline"
                    prepend-inner-icon="mdi-plus-circle-outline"
                    @click:prepend-inner="OpenNode"
                    ></v-text-field>
            </v-sheet>
            <v-card-text class="pa-2">
                <v-treeview
                    :active.sync="active"
                    :items="mdTreeRef"
                    activatable
                    open-on-click
                    dense
                    open-all
                    transition
                    ref="Treeview"
                    >
                    <template v-slot:prepend="{ item, open }">
                        <v-icon v-if="item.children.length > 0">
                            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                        </v-icon>
                        <v-icon v-else>
                            mdi-file
                        </v-icon>
                    </template>
                </v-treeview>
            </v-card-text>
        </v-card>
    </SimpleTransition>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, computed, watch, onUpdated } from '@vue/composition-api'

    import RippleTransitionFlip from '../util/components/RippleTransitionFlip.vue'
    import SimpleTransition from '../util/components/SimpleTransition.vue'

    import { IMdData } from '@/models/mdData'
    import { GetMapperTreeId2MdId, GetMdTree } from '@/util/mdLoader'
    import { FiltMdTreeByMdId, Search } from '@/util/nlp'

    export default defineComponent({
        name: 'SidebarTabsAdvance',
        components:{
            RippleTransitionFlip,
            SimpleTransition,
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
        setup(props, {emit, refs}){
            const mdTree = computed( () => GetMdTree(props.contents) )
            const mapperTreeId2MdId = computed( () => GetMapperTreeId2MdId(mdTree.value))
            const mapperMdId2TreeId = computed( () => GetMapperTreeId2MdId(mdTree.value, true))

            const active = ref([0])
            const EmitSelectedItem = () => emit("update:selectedItem", mapperTreeId2MdId.value[active.value[0]])
            EmitSelectedItem()
            watch( () => props.selectedItem, () => active.value = [mapperMdId2TreeId.value[props.selectedItem]] )
            watch( active, (newValue, oldValue) => {
                if (newValue.length == 0) {
                    active.value.push(oldValue[0])
                    return
                }
                EmitSelectedItem()
            })
            // ==================================================================================
            const OpenNode = () => (refs.Treeview as any).updateAll(true)
            // ==================================================================================
            const search = ref("")
            const isSearch = computed( () => (search.value || "").trim().length > 0 )
            const mdIds = computed( () => !isSearch.value ? [] : Search(props.contents, search.value))
            const filteredMdTree = computed( () => mdIds.value.length > 0 ? FiltMdTreeByMdId(mdTree.value, mdIds.value) : [] )
            const mdTreeRef = computed( () => isSearch.value ? filteredMdTree.value : mdTree.value )
            onUpdated(OpenNode)
            // ==================================================================================

            return {
                mdTree,
                active,
                search,
                mdTreeRef,
                OpenNode,
            }
        }
    })
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
    .SidebarTabsAdvance{
        .theme--light.v-treeview .v-treeview-node__root.v-treeview-node--active:hover::before, 
        .theme--light.v-treeview .v-treeview-node__root.v-treeview-node--active::before,
        .theme--light.v-treeview--hoverable .v-treeview-node__root:hover::before,
        .theme--light.v-treeview .v-treeview-node--click > .v-treeview-node__root:hover::before{
            border-radius: 15px;
        }
    
        .v-input.v-text-field .v-input__slot{
            padding-left: 12px;
            padding-right: 12px;
        }
    
        .v-text-field.v-text-field--solo.v-input--dense > .v-input__control{
            min-height: 32px;
        }

        .v-text-field__slot{
            margin-left: 6px;
        }
    }
</style>
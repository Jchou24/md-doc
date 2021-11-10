<template>
    <div class="NavThemeBtn">
        <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    dark
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>

            <v-list dense>
                <v-subheader class="text-h6 font-weight-bold pl-5">Theme</v-subheader>
                <v-divider></v-divider>
                <v-list-item class="my-n2">
                    <v-radio-group v-model="themeIdx">
                        <v-radio
                            v-for="n in ThemeLength"
                            :key="n"
                            :label="`${ThemeName[n-1]}`"
                        ></v-radio>
                    </v-radio-group>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, PropType } from '@vue/composition-api'

    import { ITheme } from '@/models/theme'
    import { Themes } from '@/models/constant/theme'

    export default defineComponent({
        name: 'NavThemeBtn',
        components:{
            
        },
        props:{
            theme:{
                type: Number as PropType<Themes>,
                default: Themes.default,
            }
        },
        setup(props, { root }){
            const themeIdx = ref(props.theme)

            const GetCssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name)
            const SetCssVar = (name: string, val: string) => document.documentElement.style.setProperty(name, val);
            const SetThemeVar = (theme: ITheme) => {
                SetCssVar("--v-primary-base", theme.primary)
                SetCssVar("--quote-highlight-bg", theme.quoteHighlightBg)
                SetCssVar("--quote-bg", theme.quoteBg)
                SetCssVar("--tr-row-bg", theme.trRowBg)
                SetCssVar("--gradient-bg", theme.gradientBg)
            }
            const LoadTheme = (theme: Themes): ITheme => {
                switch (theme) {
                    case Themes.blue:                        
                        return {
                            primary: GetCssVar("--color-blue-base"),
                            quoteHighlightBg: GetCssVar("--color-blue-light-1"),
                            quoteBg: GetCssVar("--gradient-bg-blue-2"),
                            trRowBg: GetCssVar("--color-blue-light-1"),
                            gradientBg: GetCssVar("--gradient-bg-blue"),
                        }

                    case Themes.green:
                        return {
                            primary: GetCssVar("--color-green-base"),
                            quoteHighlightBg: GetCssVar("--color-green-light-1"),
                            quoteBg: GetCssVar("--gradient-bg-green-2"),
                            trRowBg: GetCssVar("--color-green-light-1"),
                            gradientBg: GetCssVar("--gradient-bg-green"),
                        }
                
                    default:
                        return {
                            primary: GetCssVar("--color-default-base"),
                            quoteHighlightBg: GetCssVar("--color-default-light-1"),
                            quoteBg: GetCssVar("--gradient-bg-default-2"),
                            trRowBg: GetCssVar("--color-default-light-1"),
                            gradientBg: GetCssVar("--gradient-bg-default"),
                        }
                }
            }
            const SetTheme = (theme: Themes) => SetThemeVar(LoadTheme(theme))

            const ThemeName = {
                [Themes.blue]: "Blue",
                [Themes.green]: "Green",
                [Themes.default]: "Default",
            }

            const ChangeTheme = () => {
                switch (themeIdx.value) {
                    case 1:
                        SetTheme(Themes.blue)
                        break;
                    case 2:
                        SetTheme(Themes.green)
                        break;
                    default:
                        SetTheme(Themes.default)
                        break;
                }
            }
            watch(themeIdx, ChangeTheme)
            ChangeTheme()

            return {
                themeIdx,
                ThemeName,
                ThemeLength: Object.keys(ThemeName).length,
            }
        }        
    })
</script>

<style lang="scss" scoped>
</style>
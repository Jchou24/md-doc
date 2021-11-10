功能
    [O] viewer mode
    [O] editor mode
        幫助大家可以直接看自己改的文章
        [O] 要有 toast 提醒文件並未儲存
        [X] 編輯視窗左右連動
    [O] toast
        sm size
            要滿版
    [O] 要有 sidebar toc
    [O] code block
        scrollbar左右滾動時，line number 不要跟著移動
    [O] NAV BG 上 gradient
        左上深藍 右下淺藍
    [O] img viewer
    [O] Transform Core
        [O] TOC
            [O] 沒有item時，隱藏自己
        [O] Markdown-it
        [O] primsm plugin
            [O] line-highlight
                example
                    ```json:line='2-3'
                    {
                        a: 123
                    }
                    ```
                    treeview 也可以用
                Possible Setting
                    5
                    1-5
                    1,4
                    1-2,5,9-20
                        中間不能有空格
                ref
                    https://prismjs.com/plugins/line-highlight/

            [O] treeview
                folder的話要雙斜線結尾
                    example
                        ```treeview
                        root folder//
                        |-- b00.js
                        |   |-- b01.cs
                        |   `-- b02
                        456
                        `-- c00
                            |-- c01
                            `-- c02
                        ```
                ref
                    https://github.com/Golmote/prism-treeview

TODO
    [O] 閱讀模式右邊加上 PagePreviewScrollbar
    [O] nav
        [O] 縮合
        [O] sidebar button
        [O] sm size 顯示 icon
    [O] sidebar
        [O] 用 Vuetify 去產
        [O] 要能夠左右滑動連結
        [O] sidebar sm toggle parallex
    [O] 編輯模式
    [O] 有的時候 Primsm 的 code number 會跑版跑到最左邊
        當 component 還沒完成 primsm 的 update 就被 unmount 的話
        code number 找 parent 時，就會找到預期外的 parent
    [O] 單文件多個 tab
        [O] 靠 html section 去切分頁
            [O] 一個 section.article 一個分頁
            [O] data-title 當作文章 title
            [O] data-category 當作文章分類
        [O] SidebarTabs
            sidebar 加一個 card，一個card element代表一個 tab
        [O] nav 的 document/editor 為對當前 tab 進行編輯/檢視
        [O] nav 的 document 改為 tab title
    [O] 寫法Example
        [O] 開一個 readme 在 header 上
            說明怎麼用 section class data-attr 來做文章的設定
        [O] 預設有寫法說明文件放在 tab 裡面
            [O] 預設寫法可以寫在 .js 裡面
            [O] mermaid example
            [X] flowchart example    
    [O] SidebarTabsAdvance
        [O] 用 data-category 來對文章分類
        [O] 要能搜尋文章
            [X] 全文搜尋
            [O] 字串比對
                [O] 內文
                [O] Title
        [X] 要能filter類別
    [O] 切頁的時候固定回到最上面
    [O] Theme
        [O] 分成3個 style
            [O] default 灰
            [O] 藍
            [O] 綠
        [O] 初始 config 機制
        [O] theme 的設定機制再寫進 readme
            可以不寫 window['md-doc'].default.install(window.Vue)
            也可以加上 config 來調整 theme
                config = { 
                    theme: 'default', // 'default', 'blue', 'green'
                }
                window['md-doc'].default.install(window.Vue, config) 
    [X] IE 兼容


    

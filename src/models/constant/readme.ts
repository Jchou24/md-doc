const readme = `
# Introduction

此工具為輕便 Markdown Render 文件

不用架設在 server 上

用 browser 打開就能看到 render 後之 markdown 文件

** ***Note*** **

建議使用此文件時，避免將文件內容寫得過於龐大

這可能會對未來的文件管理帶來些挑戰

# Quick Start

如以下範例

1. 引用 css, js

    * \`Line 16, 17\`: js 需要引用 \`Vue.min.js\` 以及 \`md-doc.umd.min.js\`
    * \`Line 7\`: css 需要引用 \`md-doc.css\`
    * 引用順序請參考下方範例
    * js, css 路徑請於使用時，填上您的專案目錄結構下的對應檔案路徑
        * <b style="color: brown">範例中的檔案路徑僅供參考</b>

2. \`Line 15\`: 加入 \`<div id="app"></div>\`

3. \`Line 10\`: 在 html 中之 \`<section class="article">\` 中寫 markdown，Markdown Doc 便會自動 render 文件

4. 詳細的設定請參考 \`Usage\`

5. 實際使用範例請參考 \`/md-doc/public/demo.html\`

\`\`\`html:line='7,10,15,16,17'
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="stylesheet" href="../dist/md-doc.css">
    </head>
    <body>
        <section class="article">

Write Your Markdown Here

        </section>
        <div id="app"></div>
        <script src="./js/vue.min.js"></script>
        <script src="../dist/md-doc.umd.min.js"></script>
    </body>
</html>
\`\`\`


# Usage

## Markdown

關於可使用的 Markdown 文件，可以參考右上角的 \`Example\`

其中附有即時 Editor，可以進行語法的嘗試

<b style="color: brown">當中的任何編輯是不會被儲存的，此功能僅供測試語法用</b>

## Multi Document

* 一個 Markdown 文件需包於 \`<section class="article"></section>\` 中

* 當希望將內容切成多個 tab 時，可以將內容分別寫在不同的 \`section\` 中

\`\`\`html:line='10,14,15,19,20,24'
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="stylesheet" href="../dist/md-doc.css">
    </head>
    <body>
        <section class="article">

# My Markdown Article 1

        </section>
        <section class="article">

# My Markdown Article 2

        </section>
        <section class="article">

# My Markdown Article 3

        </section>
        <div id="app"></div>
        <script src="./js/vue.min.js"></script>
        <script src="../dist/md-doc.umd.min.js"></script>
    </body>
</html>
\`\`\`

## Document Title

* 透過設定 \`data-title\` 可以設定文章的 Title

* 若沒有進行設定，預設會是 Doc-{number}

\`\`\`html:line='10,15,20'
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="stylesheet" href="../dist/md-doc.css">
    </head>
    <body>
        <section class="article" data-title="Article-1">

# My Title is Article-1

        </section>
        <section class="article">

# My Title is Doc-2

        </section>
        <section class="article">

# My Title is Doc-3

        </section>
        <div id="app"></div>
        <script src="./js/vue.min.js"></script>
        <script src="../dist/md-doc.umd.min.js"></script>
    </body>
</html>
\`\`\`

## Document Category

* 透過設定 \`data-category\` 可以設定文章的分類

* 類別之間需用 \`/\` 來分隔

* 預設會歸類在 \`root\` 底下

\`\`\`html:line='10,15,20,25,30'
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="stylesheet" href="../dist/md-doc.css">
    </head>
    <body>
        <section class="article" data-title="Doc-1" data-category="AAA/BBB">

# Doc-1

        </section>
        <section class="article" data-title="Doc-2" data-category="AAA/BBB">

# Doc-2

        </section>
        <section class="article" data-title="Doc-3" data-category="AAA/CCC">

# Doc-3

        </section>
        <section class="article" data-title="Doc-4" data-category="BBB">

# Doc-4

        </section>
        <section class="article" data-title="Doc-5">

# Doc-5

        </section>
        <div id="app"></div>
        <script src="./js/vue.min.js"></script>
        <script src="../dist/md-doc.umd.min.js"></script>
    </body>
</html>
\`\`\`

這時會看到文章分類結構如下

\`\`\`treeview
root_folder//
|   \`-- Doc-5
|-- AAA//
|   |-- BBB//
|   |   |-- Doc-1
|   |   \`-- Doc-2
|   \`-- CCC//
|     \`-- Doc-3
\`-- BBB//
      \`-- Doc-4
\`\`\`

## Theme

可以動態選擇3種主題，也可以設定初始主題

當不做任何設定時，預設主題為 \`default\`

在畫面右上角的點點點中也可動態切換主題

目前支援的主題有

* \`default\`
* \`blue\`
* \`green\`

設定初始主題的方法如下:

\`\`\`html:line='4-6'
<script src="./js/vue.min.js"></script>
<script src="../dist/md-doc.umd.min.js"></script>
<script>
    window['md-doc'].default.install(window.Vue, {
        theme: 'default', // 'default', 'blue', 'green'
    })
</script>
\`\`\`

# Feature

## Editor 文章即時編寫測試器

當進入 Editor 時可以直接編輯該篇文章

***但此功能只是用以即時觀看語法的效果，並不會儲存修改過的文章***

修改過的文章還是需要直接手動修改 html 中之內容

## Sidebar

### Article Category Tree View

當文章數量大於1篇時，將會產生此 UI，用以

1. 檢視文章的分類結構

2. 搜尋文章

### Article Table of Content

當文章中之 H1/H2/H3 數量大於1時，將會產生此 UI，用以顯示文章大綱

## RWD

調整文件的寬，會自動調整文件的顯示

像是側邊攔會自動隱藏

# 開發/改進/擴充/發布

此工具以 Vue 生態系進行開發

並編譯成純 js library，以 \`<script>\` 來進行引用

(就像在使用 jquery 那樣)

## 擴充此工具

\`\`\`bash
npm install # 安裝相關套件

npm run serve # 開啟開發模式
\`\`\`

## 編譯、發布

\`\`\`bash
npm run build # 編譯出純 js, css 來供後續使用
\`\`\`

`.trim()

export {
    readme
}
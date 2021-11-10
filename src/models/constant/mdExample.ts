const mdExample = `
# Html

<b style="color: brown">123456</b>

# Emphasize

*123*

**123**

***123***

# list

* 123
    * 456

# hr

---

# Quote

    quote

# Inline Quote

12 \`34\` 56

# Img

* Click image will launch img viewer

![img](./img/pika.gif)

# Tables

## Basic Table

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

## Cross-Cell Table

### Multi-Line in Cell

First header | Second header
-------------|---------------
List:        | More         |\\
- over       | data         |\\
- several    |              |\\
- lines      |              |

### Merge-Column

|              |          Grouping           ||
|First Header  | Second Header | Third Header |
| ------------ | :-----------: | -----------: |
| Content      |          *Long Cell*        ||
| Content      |   **Cell**    |         Cell |
| New section  |     More      |         Data |
| And more     | With an escaped '\\|'       ||

### Merge-Row

First header | Second header
-------------|---------------
Merged       | Cell 1
^^           | Cell 2
^^           | Cell 3

# Delete

~~123~~

~~456~~

# Subscript

A~B~

CH~3~CH~2~OH

text~a\\ subscript~

# Superscript

A^B^

H^2^0

text^a\\ superscript^

# Foot Note

Hello World[^1]

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

# Task List

- [X] item 1
    * [X] item A
    * [ ] item B
        + [x] item a
        + [ ] item b
        + [x] item c
    * [X] item C
- [ ] item 2
- [ ] item 3

# Mark

==mark me==

# Code syntax hightlight

## Basic

\`\`\`python
print(123)
\`\`\`

\`\`\`python
class ImAClass():

    def __init__(self):
        pass

    @staticmethod
    def func(arg=123):
        """
        Hello World
        """
        a, b = 1, 2
        lis = [
            'Hello', #Hello
            'World!' #World!
        ]

        dic = {
            "Hello": 0,
            "World!": 1
        }

        return { **dic, **{"x":lis}, **{"y": a+b} }

>>> message = """123
... 456"""
\`\`\`

## Different Language

\`\`\`csharp
var x = 123456;
\`\`\`

## Line Highlight

\`\`\`json:line='2-3'
{
    a: 123
}
\`\`\`

* Possible Setting
    * 5
    * 1-5
    * 1,4
    * 1-2,5,9-20
        * 中間不能有空格
* ref: [primsm line-highlight](https://prismjs.com/plugins/line-highlight/)

## Css Previewer

\`\`\`css
@font-face {
	src: url(http://lea.verou.me/logo.otf);
	font-family: 'LeaVerou';
}

span.foo {
	background-color: navy;
	color: #BFD;
}

span.bar {
	background: rgba(105, 0, 12, .38);
	color: hsl(30, 100%, 50%);
	border-color: transparent;
}
\`\`\`

## URL Auto Link

\`\`\`python
print(123)
# https://www.python.org/downloads/
\`\`\`

## [Treeview](https://github.com/Golmote/prism-treeview)

* folder的話要雙斜線結尾

\`\`\`treeview
root folder//
|-- b00.js
|   |-- b01.cs
|   \`-- b02
456
\`-- c00
    |-- c01
    \`-- c02
\`\`\`

\`\`\`treeview:line='1,3-5,9-12'
root_folder//
|-- a first folder//
|   |-- holidays.mov
|   |-- javascript-file.js
|   \`-- some_picture.jpg
|-- documents//
|   |-- spreadsheet.xls
|   |-- manual.pdf
|   |-- document.docx
|   \`-- presentation.ppt
|       \`-- test    
|-- empty_folder//
|-- going deeper//
|   |-- going deeper//
|   |   \`-- going deeper//
|   |        \`-- going deeper//
|   |            \`-- .secret_file
|   |-- style.css
|   \`-- index.html
|-- music and movies//
|   |-- great-song.mp3
|   |-- S01E02.new.episode.avi
|   |-- S01E02.new.episode.nfo
|   \`-- track 1.cda
|-- .gitignore
|-- .htaccess
|-- .npmignore
|-- archive 1.zip
|-- archive 2.tar.gz
|-- logo.svg
\`-- README.md
\`\`\`

\`\`\`treeview
root_folder//
├── a first folder //
|   ├── holidays.mov
|   ├── javascript-file.js
|   └── some_picture.jpg
├── documents//
|   ├── spreadsheet.xls
|   ├── manual.pdf
|   ├── document.docx
|   └── presentation.ppt
└── etc.
\`\`\`

# Katex

[Katex Syntax](https://khan.github.io/KaTeX/docs/supported.html)

## Inline Katex

Hello $p(x|y) = \\frac{p(y|x)p(x)}{p(y)}$ World

## Block Katex

$$
a^2 + b^2 = c^2
$$

## Block Katex With Tags

$$
\\tag{hi} x+y^{2x}
$$

$$
\\tag{1} p(v_i=1|\\mathbf{h}) = \\sigma\\left(\\sum_j w_{ij}h_j + b_i\\right)
$$

$$
\\tag{2} p(h_j=1|\\mathbf{v}) = \\sigma\\left(\\sum_i w_{ij}v_i + c_j\\right)
$$

# Mermaid

## Flowchart

\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`

## Sequence diagram
\`\`\`mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
\`\`\`

## Gantt diagram

\`\`\`mermaid
gantt
dateFormat  YYYY-MM-DD
title Adding GANTT diagram to mermaid
section A section
Completed task            :done,    des1, 2014-01-06,2014-01-08
Active task               :active,  des2, 2014-01-09, 3d
Future task               :         des3, after des2, 5d
Future task2               :         des4, after des3, 5d
\`\`\`

# PlantUML

@startuml
Bob -> Alice : hello
@enduml

@startuml
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]
@enduml

`.trim()

export {
    mdExample
}
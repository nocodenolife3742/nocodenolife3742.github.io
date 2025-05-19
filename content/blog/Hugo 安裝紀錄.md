---
title: Hugo 安裝紀錄
date: 2025-05-18
authors:
  - name: nocodenolife3742
    link: https://github.com/nocodenolife3742
    image: https://github.com/nocodenolife3742.png
tags:
  - Hugo
  - Guide
---

這篇文章是 Hugo 的安裝紀錄，包含了安裝步驟和一些基本的使用方法。
<!--more-->

## 前置作業

### 安裝 Git

在 Windows 上安裝 Git 可以直接到 [Git 官網](https://git-scm.com/download/win)下載安裝程式，然後一路點擊下一步即可完成安裝。
安裝完成後，打開 Git Bash，輸入以下指令來檢查是否安裝成功：

```bash
git --version
```

### 安裝 Go

在 Windows 上安裝 Go 與 Git 類似，可以到 [Go 官網](https://go.dev/dl/)下載安裝程式，也是一路點擊下一步即可完成安裝。
安裝完成後，打開命令提示字元，輸入以下指令來檢查是否安裝成功：

```bash
go version
```

### 安裝 Hugo

Hugo 有多種安裝方式，這裡介紹的是最簡單的安裝方式，首先到 github 上的 [Hugo Releases](https://github.com/gohugoio/hugo/releases)，下載最新版本的 Hugo 壓縮檔，然後解壓縮到你想要的目錄下。
接著將解壓縮後的 `hugo.exe` 加到系統環境變數中，這樣就可以在任何地方使用 Hugo 指令了。

可以在命令提示字元中輸入以下指令來檢查是否安裝成功：

```bash
hugo version
```

## 主題設定

### 選擇主題

Hugo 有很多現成的主題可以使用，且這些主題都可以在 [Hugo Themes](https://themes.gohugo.io/) 上找到。目前最受歡迎的主題是 [PaperMod](https://themes.gohugo.io/themes/hugo-papermod/)，但我喜歡Table of Contents放在右邊，所以選擇了 [Hextra](https://themes.gohugo.io/themes/hextra/)。

### 安裝主題

由於 Hextra 主題的官方建議的安裝方式是從 [template](https://github.com/imfing/hextra-starter-template) 開始，所以我們可以直接從這個 template 開始安裝。

```bash
git clone https://github.com/imfing/hextra-starter-template.git
```

接著進入到 `hextra-starter-template` 目錄下，然後使用以下指令來安裝主題：

```bash
hugo mod tidy
hugo server --logLevel debug --disableFastRender -p 1313
```

這樣就可以在 `http://localhost:1313` 上看到 Hextra 主題的預覽了。

### 更新主題

如果要更新主題，可以使用以下指令：

```bash
hugo mod get -u
hugo mod tidy
```

這樣就可以更新到最新版本的主題了。

## 撰寫文章

### 目錄結構

預設情況下，Hugo 會在 `content` 目錄中尋找 Markdown 檔案，且目錄結構會決定網站的輸出結構。
以下是一個簡單的範例：

{{< filetree/container >}}
  {{< filetree/folder name="content" >}}
    {{< filetree/file name="_index.md" >}}
    {{< filetree/folder name="blog" state="open" >}}
      {{< filetree/file name="_index.md" >}}
      {{< filetree/file name="my-first-post.md" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}

每個 `_index.md` 是用來定義目錄的索引頁面，這個頁面會在網站上顯示目錄的標題和描述。

### 撰寫文章

要撰寫文章，可以在 `content` 目錄下建立一個新的 Markdown 檔案，文章的格式如下：

```markdown
---
title: "文章標題"
date: 2000-01-01
---
這是文章的內容。
```

這樣就可以在網站上看到這篇文章了，其於文章的格式可以參考 [Markdown 語法](https://www.markdownguide.org/basic-syntax/) 及 [Hextra 說明文件](https://imfing.github.io/hextra/docs/)。




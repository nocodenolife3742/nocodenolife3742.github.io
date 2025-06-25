---
title: Sanitizers
date: 2025-06-23
authors:
  - name: nocodenolife3742
    link: https://github.com/nocodenolife3742
    image: https://github.com/nocodenolife3742.png
tags:
  - C
  - C++
  - Sanitizers
  - Guide
---

這篇文章是關於 C/C++ 中的 Sanitizers 的介紹，包含了 Sanitizers 是甚麼、如何使用 Sanitizers、 Sanitizers 的種類以及使用範例。
<!--more-->

## Sanitizers 是甚麼？

Sanitizers 是 Google 開發的一組工具，用於檢測 C/C++ 程式中的各種錯誤。它們可以幫助開發者在程式運行時發現和修復潛在的問題，如 memory leaks、undefined behavior 等。

## 如何使用 Sanitizers？

要使用 Sanitizers，首先需要在編譯時啟用它們。

使用 GCC 或 Clang 編譯器時，可以通過添加 `-fsanitize` 選項來啟用相應的 Sanitizer。
```bash
# 啟用 AddressSanitizer, UndefinedBehaviorSanitizer
gcc -fsanitize=address,undefined -g -o program program.c
```

裡面有兩個重要的參數：
- `-fsanitize=address,undefined`：啟用 Sanitizers。注意有些 Sanitizers 不能同時啟用。
- `-g`：生成 debug 信息，通常是給 gdb 使用的，可以在出現錯誤時獲得更詳細的資訊。

## Sanitizers 的種類

Sanitizers 有多種類型，每種 Sanitizer 都針對不同的問題進行檢測。以下是一些常用的 Sanitizers：

### AddressSanitizer (ASan)
AddressSanitizer 用於檢測 C/C++ 程式中的 memory 錯誤，如：
- Use after free
- Use after return
- Buffer overflow (Heap/Stack/Global)
- Memory leaks

### UndefinedBehaviorSanitizer (UBSan)
UndefinedBehaviorSanitizer 用於檢測 C/C++ 程式中的 undefined behavior，如：
- Integer overflow
- Division by zero
- Misaligned pointer access
- Invalid shift

### MemorySanitizer (MSan)
MemorySanitizer 用於檢測 C/C++ 程式中的 uninitialized memory 使用。雖然名字中有 `Memory`，但它並不檢測 memory leaks。他的主要功能是檢測：
- Uninitialized memory access
- Uninitialized pointer dereference

## 使用範例
以下是一個簡單的範例：
```c
int main()
{
    int *leak = new int[100];
    return 0;
}
```

通過 AddressSanitizer 編譯這個程式並執行：
```bash
g++ -g -fsanitize=address main.cpp
./a.out
```

執行後會輸出類似以下的錯誤信息：
```text

=================================================================
==37552==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 400 byte(s) in 1 object(s) allocated from:
    #0 0x763f180fe6c8 in operator new[](unsigned long) ../../../../src/libsanitizer/asan/asan_new_delete.cpp:98
    #1 0x57f0b89e819e in main /home/eric/nocodenolife3742.github.io/main.cpp:3
    #2 0x763f1782a1c9 in __libc_start_call_main ../sysdeps/nptl/libc_start_call_main.h:58
    #3 0x763f1782a28a in __libc_start_main_impl ../csu/libc-start.c:360
    #4 0x57f0b89e80c4 in _start (/home/eric/nocodenolife3742.github.io/a.out+0x10c4) (BuildId: 1a3c2692bac8b178c7badab5c18ac7e76fa39354)

SUMMARY: AddressSanitizer: 400 byte(s) leaked in 1 allocation(s).
```
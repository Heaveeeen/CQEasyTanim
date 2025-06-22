# Easy Tanim

[github](https://github.com/Heaveeeen/CQEasyTanim)

时间轴动画（Easy Tanim）是一个 Scratch 扩展。本扩展能够轻松实现时间轴动画。内置动画编辑器。完美兼容turbowarp。

---

## 使用方法

目前该扩展正在开发中，仅为半成品，功能并不完善。

如果想要使用，请下载`dist/CQEasyTanim.js`，这个文件是此扩展的本体。如果无法下载，请把这个文件的内容手动复制下来，粘贴到一个新文件中，并将文件的后缀名改为`.js`。

或者，也可以自行将`src/CQEasyTanim.ts`编译为 js 。

### 通过本地服务器加载

适用于 Turbowarp 和 Gandi 。

请搭建一个本地服务器，开放端口8080，将扩展文件放到服务器路径下，并通过形如 `http://localhost:8080/CQEasyTanim.js` 的 URL 加载扩展。

关于本地服务器，请自行搜索“搭建本地服务器”相关的教程。

### 通过文件加载

适用于 Turbowarp 。

使用 Turbowarp 加载此扩展的文件（`CQEasyTanim.js`），并勾选“不使用沙盒运行扩展(Run extension without sandbox)”以在非沙盒模式下加载扩展。

此扩展必须在非沙盒模式下运行，所以在加载扩展时，必须启用非沙盒模式。

如果使用文件加载此扩展，此后每次重新打开作品时，都会弹出提示框询问是否允许以非沙盒模式加载该扩展。推荐使用 URL 并从 `http://localhost:8080/` 加载以解决这个问题。

也可以将此扩展的源码直接粘贴到 Turbowarp 中，通过源码加载。此方法与文件基本同理。

---

## 制作人员信息

作者：苍穹

感谢 arkos、白猫、simple、允某、酷可mc 等人，他们给我提供了许多帮助，在此不一一列举。（太多了列不出来）

arkos 真的给我提供了很多技术上的帮助，教我怎么写扩展，我爱他❤️

一些缓动函数抄自 https://blog.51cto.com/u_15057855/4403832 （从 Animator 扩展那里翻到的链接，非常感谢！）

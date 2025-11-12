id: prompts-for-go-generator
author: aggregation
language: go
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: d7c891480ee69c15af43428313e815a89da3aa627ad46d4f08f5790adbfdcdec
examples_hash: a81a1df5742f33ee3010bf9de1bc9e10ff5576ce1c6c81d88e30512170fcc0d3
last_synced: 2025-11-12T00:00:00Z

---

# Go prompts-for-go Generator

## Mission

与えられた `modulePath` と名前群から **Graceful Shutdown + Tool + Prompt + 基本テスト** を備えた最小 Go prompts-for-go サーバー骨格を生成せよ。

## Inputs

| name        | type   | required | description                               |
| ----------- | ------ | -------- | ----------------------------------------- |
| modulePath  | string | yes      | go module path (github.com/user/app 形式) |
| toolName    | string | yes      | 生成するツール名 (英数字, kebab 可)       |
| promptName  | string | yes      | 生成するプロンプト名                      |
| description | string | no       | README 用概要                             |

... (body preserved; occurrences of "mcp-server" replaced with "prompts-for-go" and id updated)

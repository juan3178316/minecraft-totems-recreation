# Code in explain
_here show how JSON and JavaScript code is used for recreate the Minecraft totem of undying (bedrock edition), the next table of contents have all list of each part of code in the recreation._
> [!warning]
> Maybe I'll forget any to explain in the code so check if that's right all. :)

<details>
  <summary>Table of content (click to show)</summary>

  - [JSON language](#json-language)
    - [Custom item with their components](#custom-item-with-their-components)
  - [JavaScript language](#javascript-language)
  - [BACK](index.md)
</details>

## JSON language
When you're coming to coding, your custom totem of undying item need this component data:
+ **"minecraft:allow_off_hand":** the component allow use the totem in offhand, because in Javascript code the offhand check first instead of mainhand (like the totem of undying)

+ **"minecraft:cooldown":** This is important, when your custom totem of undying it's popped create a cooldown in JS for avoid spam with the totem amount, by default in the item components the duration is 0 for avoid the totem have the cooldown in each interaction:
  ```json
  "components": {
    "minecraft:cooldown": {
      "category": "ct_on_use",
      "duration": 0
    }
  ```

> [!tip]
> please create and use a custom category for cooldown, for avoid use default cooldown category.
> use the duration in 0 seconds, you can adjust the time in JS.

> More about this one: [_Cooldown (item component) - bedrock Wiki_](https://wiki.bedrock.dev/items/item-components#cooldown)

+ **"minecraft:stacked_by_data":** recommend enable this component for avoid bug with stack the totems.
+ **"minecraft:tags":** it's optional use this component, is useful with you're creating only 1 custom totem, but if you want to create many custom totems with own properties, you need work in JS.
  ```json
  "components": {
    "minecraft:tags": {
      "tags": [ "ct:custom_totem" ]
    }
  ```

> More about this one: [_Tags (item component) - bedrock Wiki_](https://wiki.bedrock.dev/items/item-components#tags)

### Custom item with their components

see the code: [BH/items/custom_totem.json](https://github.com/juan3178316/minecraft-totems-recreation/blob/main/behaviors/items/custom_totem.json)

## JavaScript language

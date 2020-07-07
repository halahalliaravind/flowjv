---
description: JSON representation of Javascript expression.
---

# JSON Expression

Logic defined in Flow Schema can be a normal javascript function as below.

```javascript
{
    logic: ({data, ref})=>validate(data.anything, ref),
    err: "Logic Error If any"
}
```

It's very easy, and something we're so familiar with. But the code above is not serializable. This means we can not store the schema somewhere in a database or a file to dynamically retrieve it later.

This also prevents us from using tools that can dynamically generate flow schema.

To get over this `flowjv` also provides a utility called `JSONExpression`. With this, we can write any javascript expression as a JSON representation.

{% hint style="info" %}
JSON Expression is not a one to one mapping with Javascript expression. There are a lot of things that are not possible with JSON Expression and never will be. Based on the requirements, JSON Expression evolves with all the essentials over time. Raise an [issue](https://github.com/pkishoez/flowjv/issues/new/choose) if you think some kind of expression should be included into it.
{% endhint %}

Javascript expression by nature has infix notation. But, a JSON Expression uses a prefix notation.

![Basic JS expression to JSON expression](../../.gitbook/assets/basic.gif)

1. JSON expression takes its operands and operators in an array. Where the first param is an operator and the second element itself is an array of operands.
2. An operand itself can be a JSON expression! Hence we can create compound javascript expression by nesting JSON expressions.

![Composite JS expression to JSON expression](../../.gitbook/assets/composite.gif)

{% hint style="info" %}
JSON Expression is not mandatory for using `flowjv`. But getting used to it provides a lot of benefits from readability to predictability.
{% endhint %}

You can look into all possible operators `JSONExpression` provides in the [source code](https://github.com/pkishoez/flowjv/blob/master/packages/flowjv/src/jsonlogic/index.ts) for now. We'll move that to documentation later.


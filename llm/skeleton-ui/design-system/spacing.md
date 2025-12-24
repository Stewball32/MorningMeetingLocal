https://www.skeleton.dev/docs/svelte/design/spacing.md
last downloaded 2025-11-30

# Spacing

Set a dynamic scale for application whitespace.

Skeleton utilizes the power of Tailwind to provide a universal system for customizing spacing throughout your application. While enabling this customization per each theme.

<Preview client:visible>
  <Default client:visible />
</Preview>

## How It Works

In recent versions of Skeleton, this is implemented using the official [Tailwind Spacing](https://tailwindcss.com/blog/tailwindcss-v4#dynamic-utility-values-and-variants) property.

```css
@layer theme {
  :root {
    --spacing: 0.25rem;
  }
}
```

However, this can be customized to each Skeleton theme.

```css
[data-theme="cerberus"] {
  --spacing: 0.25rem;
}
[data-theme="mona"] {
  --spacing: 0.2rem;
}
```

## Supported Properties

The scaling system supports all relevant Tailwind utility classes, including, but not limited to:

`padding`, `margin`, `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight`, `gap`, `inset`, `space`, `translate`

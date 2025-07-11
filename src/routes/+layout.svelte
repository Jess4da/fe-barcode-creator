<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

{@render children()}

<svelte:head>
  <title>Barcode & QR Code Generator</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    name="description"
    content="Generate barcodes and QR codes easily with this responsive web app."
  />
  <meta name="theme-color" content="#ffffff" />
  <meta name="keywords" content="barcode, QR code, generator, web app, responsive" />
  <meta name="author" content="Jess4da" />
  <meta property="og:title" content="Barcode & QR Code Generator" />
  <meta
    property="og:description"
    content="Generate barcodes and QR codes easily with this responsive web app."
  />
  <meta property="og:image" content="/favicon.svg" />
  <meta property="og:url" content="https://barcode.meatchopper.xyz" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Barcode & QR Code Generator" />
  <meta
    name="twitter:description"
    content="Generate barcodes and QR codes easily with this responsive web app."
  />
  <meta name="twitter:image" content="/favicon.svg" />
  <meta name="twitter:site" content="@jess4da" />
  <meta name="twitter:creator" content="@jess4da" />
</svelte:head>

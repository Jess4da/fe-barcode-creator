<script lang="ts">
  import BarcodeGenerator from "$components/BarcodeGenerator.svelte";
  import Footer from "$components/Footer.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="min-h-screen flex flex-col">
  <main class="flex-1">
    <BarcodeGenerator initText={data.query.text} />
  </main>

  <footer class="mt-auto border-t border-base-300 bg-base-200/50">
    <Footer />
  </footer>
</div>

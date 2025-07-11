<script lang="ts">
  import BarcodeGenerator from "$components/BarcodeGenerator.svelte";
  import Footer from "$components/Footer.svelte";
</script>

<div class="min-h-screen flex flex-col">
  <main class="flex-1">
    <BarcodeGenerator />
  </main>

  <footer class="mt-auto border-t border-base-300 bg-base-200/50">
    <Footer />
  </footer>
</div>

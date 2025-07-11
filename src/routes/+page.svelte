<script lang="ts">
  import { onMount } from "svelte";
  import JsBarcode from "jsbarcode";
  import QRCode from "qrcode";

  let inputText = $state("");
  let barcodeCanvas = $state<HTMLCanvasElement>();
  let qrcodeCanvas = $state<HTMLCanvasElement>();
  let isClient = $state(false);
  let isClipboardLoading = $state(false);

  onMount(() => {
    isClient = true;
    // Generate initial codes with default text
    if (inputText) {
      generateCodes();
    }

    // Add resize listener for responsive code generation
    const handleResize = () => {
      if (inputText.trim()) {
        generateCodes();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  async function pasteFromClipboard() {
    if (isClipboardLoading) return; // Prevent multiple simultaneous requests

    isClipboardLoading = true;

    try {
      // Check if clipboard API is supported
      if (!navigator.clipboard) {
        alert("Clipboard access is not supported in this browser. Please copy and paste manually.");
        return;
      }

      // Request clipboard permission first (especially important on mobile/iOS)
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({
            name: "clipboard-read" as PermissionName,
          });
          if (permission.state === "denied") {
            alert(
              "Clipboard access has been denied. Please enable clipboard permissions in your browser settings and try again."
            );
            return;
          }
        } catch (permissionError) {
          // Some browsers don't support permission query for clipboard
          console.log("Permission query not supported, attempting direct clipboard access");
        }
      }

      // Attempt to read from clipboard
      const text = await navigator.clipboard.readText();

      if (!text || text.trim() === "") {
        alert("Clipboard is empty or contains no text content.");
        return;
      }

      inputText = text;
      generateCodes();

      // Success feedback
      console.log(
        "Successfully pasted from clipboard:",
        text.substring(0, 50) + (text.length > 50 ? "..." : "")
      );
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);

      // More specific error messages based on error type
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("denied") || errorMessage.includes("permission")) {
        alert(
          "Clipboard access denied. On mobile devices:\n\n" +
            "• iOS: Tap the input field first, then try pasting\n" +
            "• Android: Allow clipboard access when prompted\n" +
            "• Alternative: Manually copy and paste into the text field"
        );
      } else if (errorMessage.includes("not allowed") || errorMessage.includes("user activation")) {
        alert(
          "Clipboard access requires user interaction. Please try:\n\n" +
            "• Tap the paste button again\n" +
            "• Or manually paste into the text field using your device's paste option"
        );
      } else {
        alert(
          "Unable to access clipboard. You can manually paste text into the input field instead."
        );
      }
    } finally {
      isClipboardLoading = false;
    }
  }

  function generateCodes() {
    if (!isClient || !inputText.trim()) return;

    // Generate barcode
    if (barcodeCanvas) {
      try {
        // Get device width for responsive sizing
        const isMobile = window.innerWidth < 640; // sm breakpoint
        const barcodeWidth = isMobile ? 1.5 : 2;
        const barcodeHeight = isMobile ? 80 : 100;
        const fontSize = isMobile ? 12 : 14;
        const margin = isMobile ? 5 : 10;

        // High-DPI canvas setup for crisp rendering
        const devicePixelRatio = window.devicePixelRatio || 1;
        const ctx = barcodeCanvas.getContext("2d");

        // Generate barcode with higher resolution
        JsBarcode(barcodeCanvas, inputText, {
          format: "CODE128",
          width: barcodeWidth * devicePixelRatio,
          height: barcodeHeight * devicePixelRatio,
          displayValue: true,
          fontSize: fontSize * devicePixelRatio,
          margin: margin * devicePixelRatio,
        });

        // Scale down the canvas display size to maintain visual size
        const canvasWidth = barcodeCanvas.width;
        const canvasHeight = barcodeCanvas.height;
        barcodeCanvas.style.width = canvasWidth / devicePixelRatio + "px";
        barcodeCanvas.style.height = canvasHeight / devicePixelRatio + "px";

        // Improve rendering quality
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
        }
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }

    // Generate QR code
    if (qrcodeCanvas) {
      // Get device width for responsive sizing
      const isMobile = window.innerWidth < 640; // sm breakpoint
      const qrWidth = isMobile ? 250 : 300;
      const devicePixelRatio = window.devicePixelRatio || 1;

      QRCode.toCanvas(qrcodeCanvas, inputText, {
        width: qrWidth * devicePixelRatio,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then(() => {
          // Scale down the canvas display size to maintain visual size
          if (qrcodeCanvas) {
            qrcodeCanvas.style.width = qrWidth + "px";
            qrcodeCanvas.style.height = qrWidth + "px";

            // Improve rendering quality
            const ctx = qrcodeCanvas.getContext("2d");
            if (ctx) {
              ctx.imageSmoothingEnabled = false;
            }
          }
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
        });
    }
  }

  // Generate codes when input changes
  $effect(() => {
    if (isClient && inputText.trim()) {
      generateCodes();
    }
  });
</script>

<div class="container mx-auto p-4 sm:p-6 max-w-4xl">
  <div class="text-center mb-3">
    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
      Barcode & QR Code Generator
    </h1>
    <p class="text-sm sm:text-base lg:text-lg text-base-content/70 px-2">
      Enter text below or paste from clipboard to generate barcodes and QR codes instantly
    </p>
  </div>

  <!-- Input Section -->
  <div class="card bg-base-100 shadow-xl mb-3">
    <div class="card-body p-4 sm:p-6">
      <h2 class="card-title text-xl sm:text-2xl mb-3 sm:mb-4">Text Input</h2>

      <div class="form-control w-full">
        <label class="label" for="text-input">
          <span class="label-text text-base sm:text-lg">Enter your text:</span>
        </label>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            id="text-input"
            type="text"
            placeholder="Type your text here..."
            class="input input-bordered input-md w-full sm:input-lg flex-1 text-sm sm:text-base"
            bind:value={inputText}
          />
          <button
            class="btn btn-primary btn-md sm:btn-lg whitespace-nowrap"
            onclick={pasteFromClipboard}
            disabled={isClipboardLoading}
            title={isClipboardLoading ? "Accessing clipboard..." : "Paste from clipboard"}
          >
            {#if isClipboardLoading}
              <span class="loading loading-spinner loading-sm"></span>
              <span class="hidden sm:inline">Pasting...</span>
            {:else}
              <span>📋Paste</span>
            {/if}
          </button>
        </div>
        {#if inputText.trim()}
          <div class="label">
            <span class="label-text-alt text-success">✓ Ready to generate codes</span>
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if inputText.trim()}
    <!-- Barcode Section -->
    <div class="card bg-base-100 shadow-xl mb-3">
      <div class="card-body p-4 sm:p-6">
        <h2 class="card-title text-xl sm:text-2xl mb-3 sm:mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-5-3-5 3V5z"
            />
          </svg>
          <span class="text-base sm:text-xl lg:text-2xl">Barcode (CODE128)</span>
        </h2>

        <div class="flex justify-center p-3 sm:p-6 bg-base-200 rounded-lg overflow-x-auto">
          <canvas
            bind:this={barcodeCanvas}
            class="border-2 border-base-300 rounded bg-white max-w-full"
          ></canvas>
        </div>

        <div class="text-center mt-3 sm:mt-4 px-2">
          <p class="text-xs sm:text-sm text-base-content/60 break-words">
            Text: <span class="font-mono font-semibold">{inputText}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- QR Code Section -->
    <div class="card bg-base-100 shadow-xl mb-3">
      <div class="card-body p-4 sm:p-6">
        <h2 class="card-title text-xl sm:text-2xl mb-3 sm:mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <span class="text-base sm:text-xl lg:text-2xl">QR Code</span>
        </h2>

        <div class="flex justify-center p-3 sm:p-6 bg-base-200 rounded-lg">
          <canvas
            bind:this={qrcodeCanvas}
            class="border-2 border-base-300 rounded bg-white max-w-full h-auto"
          ></canvas>
        </div>

        <div class="text-center mt-3 sm:mt-4 px-2">
          <p class="text-xs sm:text-sm text-base-content/60 break-words">
            Scan with your camera to read: <span class="font-mono font-semibold">{inputText}</span>
          </p>
        </div>
      </div>
    </div>
  {:else}
    <!-- Empty State -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body text-center py-12 sm:py-16 px-4 sm:px-6">
        <div class="text-4xl sm:text-6xl mb-3 sm:mb-4">📱</div>
        <h3 class="text-xl sm:text-2xl font-semibold mb-2">Ready to Generate</h3>
        <p class="text-sm sm:text-base text-base-content/60 px-2">
          Enter some text above to see your barcode and QR code appear here
        </p>
      </div>
    </div>
  {/if}
</div>

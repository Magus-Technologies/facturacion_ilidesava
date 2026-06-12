/**
 * Descarga un PDF en segundo plano usando un iframe oculto.
 * El servidor debe responder con Content-Disposition: attachment.
 *
 * El iframe se mantiene vivo 60s: si se remueve antes de que el servidor
 * termine de generar el PDF, el navegador cancela la descarga.
 */
export function descargarPdfEnSegundoPlano(url) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => {
        if (iframe.parentNode) {
            document.body.removeChild(iframe);
        }
    }, 60000);
}

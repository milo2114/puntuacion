
document.addEventListener("DOMContentLoaded", function () {

    // Seleccionamos todas las celdas que deben funcionar como botones
    const celdasBotones = document.querySelectorAll(".td-pending, .td-missing, .td-approved, .td-rejected");

    // Añadimos un estilo de cursor pointer para que parezcan botones visualmente
    celdasBotones.forEach(celda => {
        celda.style.cursor = "pointer";
        // Efecto hover simple
        celda.addEventListener("mouseenter", () => celda.style.opacity = "0.8");
        celda.addEventListener("mouseleave", () => celda.style.opacity = "1");

        celda.addEventListener("click", function () {
            // Obtener los datos actuales de la fila (ej. TI/CC y Nombre)
            let fila = this.closest("tr");
            let documento = fila.querySelector("td:nth-child(1)").innerText;
            let nombre = fila.querySelector("td:nth-child(2)").innerText;
            let estadoActual = this.innerText;

            console.log(`Documento: ${documento}, Nombre: ${nombre}, Estado clicado: ${estadoActual}`);

            // Ejemplo: Cambiar el estado visualmente al hacer clic (Puedes adaptar esto para enviar un AJAX)
            if (this.classList.contains("td-pending")) {
                this.className = "td-approved align-middle";
                this.innerText = "Aprobado";
            } else if (this.classList.contains("td-approved")) {
                this.className = "td-rejected align-middle";
                this.innerText = "Rechazado";
            } else if (this.classList.contains("td-rejected")) {
                this.className = "td-missing align-middle";
                this.innerText = "No Presentado";
            } else if (this.classList.contains("td-missing")) {
                this.className = "td-pending align-middle";
                this.innerText = "Pendiente";
            }

            // ===== AQUI PUEDES AGREGAR TU PETICIÓN AJAX =====
            /*
            $.ajax({
              url: "ajax/verificacion.ajax.php",
          method: "POST",
          data: {documento: documento, nuevoEstado: this.innerText },
          success: function(respuesta){
              console.log("Estado actualizado en BD");
              }
            });
          */

        });
    });

    // Lógica para exportar la tabla a Excel
    const btnExcel = document.getElementById("btnExportarExcel");
    if (btnExcel) {
        btnExcel.addEventListener("click", function () {
            // Clonamos la tabla original para no alterar la vista mostrada al usuario
            let tablaOriginal = document.querySelector(".custom-table-docs");
            let tablaClon = tablaOriginal.cloneNode(true);

            let celdas = tablaClon.querySelectorAll("td");
            celdas.forEach(td => {
                // Quitamos el borde blanco para que no interfiera en excel
                td.style.border = "1px solid #000";

                // Si la celda contenía botones (los que simulan estados), extraemos su texto
                let boton = td.querySelector(".estado-btn");
                if (boton || document.querySelectorAll(".td-pending, .td-approved, .td-rejected, .td-missing").length > 0) {
                    // En caso de que esten usando la estructura anterior de las clases:
                    let texto = td.innerText.trim();
                    // Asignamos colores de fondo duros para que Excel los renderice
                    if (texto === "Aprobado") td.style.backgroundColor = "#2fb046";
                    if (texto === "Rechazado") td.style.backgroundColor = "#ed2136";
                    if (texto === "Pendiente") td.style.backgroundColor = "#ffc107";
                    if (texto === "No Presentado") td.style.backgroundColor = "#6c757d";
                    // Para evitar que exporte elementos HTML ocultos o botones de DOM, fijamos solo texto
                    td.innerHTML = texto;
                }
            });

            let htmlCode = tablaClon.outerHTML;

            let contenidoBase = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
            <head>
               <!--[if gte mso 9]>
               <xml>
                   <x:ExcelWorkbook>
                       <x:ExcelWorksheets>
                           <x:ExcelWorksheet>
                               <x:Name>Verificaciones</x:Name>
                               <x:WorksheetOptions>
                                   <x:DisplayGridlines/>
                               </x:WorksheetOptions>
                           </x:ExcelWorksheet>
                       </x:ExcelWorksheets>
                   </x:ExcelWorkbook>
               </xml>
               <![endif]-->
            </head>
            <body>
               ${htmlCode}
            </body>
            </html>
          `;

            let blob = new Blob([contenidoBase], { type: "application/vnd.ms-excel" });
            let enlace = document.createElement("a");
            enlace.href = URL.createObjectURL(blob);
            enlace.download = "Verificacion_Documentos.xls";
            enlace.click();
        });
    }

});
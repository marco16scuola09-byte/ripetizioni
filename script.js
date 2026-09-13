// ========================================
// SUPABASE
// ========================================

// Inserisci qui gli stessi dati Supabase
// che hai già nel tuo script funzionante.

const supabaseUrl = "https://cnbnifmawvwrdalsciwt.supabase.co";

const supabaseKey = "sb_publishable_XTALip4zKWgi7WoT_QjwEg_-tS9w632";


const supabaseClient =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );



// ========================================
// IMPOSTAZIONI
// ========================================

const ORARI_DISPONIBILI = [
    "15:00",
    "16:00",
    "17:00",
    "18:00"
];


const MATERIE = [
    "Matematica",
    "Italiano",
    "Scienze",
    "Storia-Geografia",
    "Filosofia",
    "Fisica"
];



// ========================================
// ELEMENTI HTML
// ========================================

const form =
    document.getElementById("form-richiesta");

const bottone =
    document.getElementById("inviaBtn");

const risultato =
    document.getElementById("risultato");

const calendario =
    document.getElementById("calendario");

const orari =
    document.getElementById("orari");

const meseAnno =
    document.getElementById("meseAnno");



// ========================================
// DATA ATTUALE
// ========================================

const oggi = new Date();

oggi.setHours(
    0,
    0,
    0,
    0
);


let meseCorrente =
    oggi.getMonth();

let annoCorrente =
    oggi.getFullYear();



// ========================================
// FORM
// ========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const nome =
            document.getElementById("nome").value.trim();

        const materia =
            document.getElementById("materia").value;

        const data =
            document.getElementById("data").value;

        const ora =
            document.getElementById("ora").value;

        const messaggio =
            document.getElementById("messaggio").value.trim();


        risultato.textContent = "";

        risultato.classList.remove(
            "successo"
        );



        // -------------------------------
        // CONTROLLI
        // -------------------------------

        if (nome === "") {

            alert(
                "Inserisci il tuo nome."
            );

            return;
        }


        if (!MATERIE.includes(materia)) {

            alert(
                "Seleziona una materia valida."
            );

            return;
        }


        if (data === "") {

            alert(
                "Seleziona una data."
            );

            return;
        }


        if (ora === "") {

            alert(
                "Seleziona un orario."
            );

            return;
        }


        if (!ORARI_DISPONIBILI.includes(ora)) {

            alert(
                "Seleziona un orario disponibile."
            );

            return;
        }



        // ========================================
        // SALVATAGGIO PRENOTAZIONE
        // ========================================

        bottone.disabled = true;

        bottone.textContent =
            "Invio in corso...";


        const {
            error: erroreInserimento
        } = await supabaseClient

            .from("prenotazioni")

            .insert([

                {

                    nome: nome,

                    materia: materia,

                    data: data,

                    ora: ora,

                    messaggio: messaggio

                }

            ]);



        bottone.disabled = false;

        bottone.textContent =
            "Invia richiesta";



        // ========================================
        // ERRORE
        // ========================================

        if (erroreInserimento) {

            console.error(
                erroreInserimento
            );


            // 23505 = prenotazione duplicata
            if (
                erroreInserimento.code === "23505"
            ) {

                alert(
                    "Questo orario è appena stato prenotato da qualcun altro. Scegline un altro."
                );

                await mostraOrari(data);

                return;
            }


            alert(
                "Non è stato possibile inviare la richiesta."
            );

            return;
        }



        // ========================================
        // SUCCESSO
        // ========================================

        risultato.textContent =
            "Grazie " +
            nome +
            "! La tua richiesta per " +
            materia +
            " del " +
            data +
            " alle " +
            ora +
            " è stata ricevuta.";


        risultato.classList.add(
            "successo"
        );



        // Aggiorna gli orari

        await mostraOrari(data);


        // Svuota il modulo

        form.reset();

    }
);



// ========================================
// CALENDARIO
// ========================================

function creaCalendario() {

    calendario.innerHTML = "";


    const primoGiorno =
        new Date(
            annoCorrente,
            meseCorrente,
            1
        );


    const giorniNelMese =
        new Date(
            annoCorrente,
            meseCorrente + 1,
            0
        ).getDate();


    const nomiGiorni = [
        "Lun",
        "Mar",
        "Mer",
        "Gio",
        "Ven",
        "Sab",
        "Dom"
    ];



    // -------------------------------
    // TITOLO
    // -------------------------------

    meseAnno.textContent =
        primoGiorno.toLocaleString(
            "it-IT",
            {
                month: "long",
                year: "numeric"
            }
        );



    // -------------------------------
    // GIORNI SETTIMANA
    // -------------------------------

    for (
        const giorno of nomiGiorni
    ) {

        const intestazione =
            document.createElement(
                "div"
            );

        intestazione.textContent =
            giorno;

        calendario.appendChild(
            intestazione
        );
    }



    // -------------------------------
    // SPAZI INIZIALI
    // -------------------------------

    const primoGiornoSettimana =
        primoGiorno.getDay();


    const spazioIniziale =
        (primoGiornoSettimana + 6) % 7;


    for (
        let i = 0;
        i < spazioIniziale;
        i++
    ) {

        const spazio =
            document.createElement(
                "div"
            );

        calendario.appendChild(
            spazio
        );
    }



    // -------------------------------
    // GIORNI DEL MESE
    // -------------------------------

    for (
        let giorno = 1;
        giorno <= giorniNelMese;
        giorno++
    ) {

        const giornoElemento =
            document.createElement(
                "button"
            );


        giornoElemento.type =
            "button";


        giornoElemento.textContent =
            giorno;



        const dataGiorno =
            new Date(
                annoCorrente,
                meseCorrente,
                giorno
            );


        dataGiorno.setHours(
            0,
            0,
            0,
            0
        );



        const giornoSettimana =
            dataGiorno.getDay();



        // -------------------------------
        // WEEKEND
        // -------------------------------

        if (
            giornoSettimana === 0 ||
            giornoSettimana === 6
        ) {

            giornoElemento.disabled =
                true;
        }



        // -------------------------------
        // GIORNI PASSATI
        // -------------------------------

        if (
            dataGiorno < oggi
        ) {

            giornoElemento.disabled =
                true;
        }



        // -------------------------------
        // CLICK
        // -------------------------------

        if (
            !giornoElemento.disabled
        ) {

            giornoElemento.addEventListener(
                "click",
                async function () {


                    const meseNumero =
                        String(
                            meseCorrente + 1
                        ).padStart(
                            2,
                            "0"
                        );


                    const giornoNumero =
                        String(
                            giorno
                        ).padStart(
                            2,
                            "0"
                        );


                    const dataSelezionata =
                        annoCorrente +
                        "-" +
                        meseNumero +
                        "-" +
                        giornoNumero;



                    // Rimuove selezioni

                    document
                        .querySelectorAll(
                            "#calendario button"
                        )
                        .forEach(
                            function (bottone) {

                                bottone.classList.remove(
                                    "selezionato"
                                );

                            }
                        );



                    // Evidenzia

                    giornoElemento.classList.add(
                        "selezionato"
                    );



                    // Inserisce data nel form

                    document.getElementById(
                        "data"
                    ).value =
                        dataSelezionata;



                    // Carica orari

                    await mostraOrari(
                        dataSelezionata
                    );

                }
            );

        }



        calendario.appendChild(
            giornoElemento
        );

    }

}



// ========================================
// ORARI
// ========================================

async function mostraOrari(data) {

    orari.innerHTML = "";


    const titolo =
        document.createElement(
            "h3"
        );


    titolo.textContent =
        "Scegli un orario";


    orari.appendChild(
        titolo
    );



    // ========================================
    // LEGGI DISPONIBILITÀ PUBBLICA
    // ========================================

    const {
        data: prenotazioni,
        error
    } = await supabaseClient

        .from("disponibilita_pubblica")

        .select("ora")

        .eq("data", data);



    if (error) {

        console.error(error);


        const errore =
            document.createElement(
                "p"
            );


        errore.textContent =
            "Impossibile caricare gli orari.";


        orari.appendChild(
            errore
        );


        return;
    }



    // ========================================
    // CREA PULSANTI
    // ========================================

    for (
        const ora of ORARI_DISPONIBILI
    ) {


        const bottoneOra =
            document.createElement(
                "button"
            );


        bottoneOra.type =
            "button";


        bottoneOra.textContent =
            ora;



        // Controlla occupazione

        const occupato =
            prenotazioni.some(
                function (prenotazione) {

                    return prenotazione.ora
                        .startsWith(ora);

                }
            );



        if (occupato) {

            bottoneOra.disabled =
                true;

            bottoneOra.textContent =
                ora +
                " - occupato";

        }


        else {

            bottoneOra.addEventListener(
                "click",
                function () {


                    const campoOra =
                        document.getElementById(
                            "ora"
                        );


                    campoOra.value =
                        ora;



                    // Rimuove selezione precedente

                    orari
                        .querySelectorAll(
                            "button"
                        )
                        .forEach(
                            function (bottone) {

                                bottone.classList.remove(
                                    "selezionato"
                                );

                            }
                        );



                    // Seleziona orario

                    bottoneOra.classList.add(
                        "selezionato"
                    );

                }
            );

        }



        orari.appendChild(
            bottoneOra
        );

    }

}



// ========================================
// AVVIO
// ========================================

creaCalendario();
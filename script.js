$(function() {
    // Imposta il calendario in italiano
    $.datepicker.setDefaults($.datepicker.regional['it']);
    
    // Carica le date selezionate dal localStorage o inizializza un array vuoto
    let selectedDates = JSON.parse(localStorage.getItem('selectedDates')) || [];
    let undoStack = [];

    function updateCalendar() {
        $("#datepicker").datepicker('refresh');
        localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
    }

    $("#datepicker").datepicker({
        dateFormat: 'yy-mm-dd',
        firstDay: 1, // Imposta il primo giorno della settimana a lunedì
        beforeShowDay: function(date) {
            const dateStr = $.datepicker.formatDate('yy-mm-dd', date);
            const isDateSelected = selectedDates.includes(dateStr);
            
            return [true, isDateSelected ? 'selected' : ''];
        },
        onSelect: function(dateText) {
            if (!selectedDates.includes(dateText)) {
                selectedDates.push(dateText);
                undoStack.push({action: "add", date: dateText});
            } else {
                selectedDates = selectedDates.filter(date => date !== dateText);
                undoStack.push({action: "remove", date: dateText});
            }
            updateCalendar();
        }
    });

    // Gestione del doppio clic
    $(document).on('dblclick', '.ui-datepicker td a', function() {
        const day = $(this).text();
        const month = $(this).closest('.ui-datepicker').find('.ui-datepicker-month').text();
        const year = $(this).closest('.ui-datepicker').find('.ui-datepicker-year').text();
        const monthIndex = $.datepicker.regional['it'].monthNames.indexOf(month);
        if (day && monthIndex >= 0 && year) {
            const dateStr = $.datepicker.formatDate('yy-mm-dd', new Date(year, monthIndex, day));
            const dateIndex = selectedDates.indexOf(dateStr);
            if (dateIndex > -1) {
                selectedDates.splice(dateIndex, 1);
                undoStack.push({action: "remove", date: dateStr});
                $(this).parent().addClass('deselected'); // Aggiunge la classe di transizione
                setTimeout(() => {
                    $(this).parent().removeClass('selected deselected'); // Rimuove entrambe le classi dopo la transizione
                    updateCalendar(); // Aggiorna il calendario
                }, 100); // Durata della transizione in millisecondi
            }
        }
    });

    // Gestione del pulsante Reset
    $("#resetButton").click(function() {
        // Ottieni il mese e l'anno attualmente visualizzati
        const month = $("#datepicker").datepicker("getDate").getMonth();
        const year = $("#datepicker").datepicker("getDate").getFullYear();

        // Filtra le date selezionate per rimuovere quelle del mese corrente
        selectedDates = selectedDates.filter(date => {
            const dateObj = new Date(date);
            return !(dateObj.getMonth() === month && dateObj.getFullYear() === year);
        });

        // Aggiorna il calendario e il localStorage
        updateCalendar();
    });

    // Gestione del pulsante Invia
    $("#submitButton").click(function() {
        const mailtoLink = `mailto:marcocecconi1@alice.it?subject=Date%20Disponibili&body=Giorni%20selezionati:%20${encodeURIComponent(JSON.stringify(selectedDates))}`;
        window.location.href = mailtoLink;
    });
}); 
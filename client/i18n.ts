import { update_available } from 'lib/core/selectors';

const i18n = {
    en: {
        activity: 'Activity',
        activity_assignment_completed:
            'has finished the card %{cardname} with %{score}.',
        activity_login: 'logged in.',
        activity_comment: 'has commented in %{cardname}',
        activities: 'Activities',
        add: 'Add',
        add_new_field: 'Add new field',
        archive: 'Archive',
        archiving: 'archiving',
        archived: 'archived',
        assign: {
            cards: 'Assign %{num} cards'
        },
        assigning: 'assigning',
        assigned: 'assigned',
        assignment: 'Assignment',
        assignments: 'Assignments',
        analytics: 'Analytics',
        back: 'back',
        cancel: 'Cancel',
        card: 'Card',
        card_add: 'Add Card',
        card_edit: 'edit %{name}',
        card_create: 'Create card',
        cards: 'Cards',
        cards_assign: 'Assign %{num} cards',
        cards_assign_explanation:
            'Assign %{num} card(s) to whole groups or individual users.',
        comment: 'Comment',
        comments: 'Comments',
        comments_no: 'No comments',
        continue: 'Continue',
        create: 'Create',
        creating: 'creating',
        created: 'created',
        delete: 'Delete',
        delete_: 'Delete %{item}',
        deleting: 'deleting',
        deleted: 'deleted',
        duplicate: 'duplicate',
        duplicating: 'duplicating',
        duplicated: 'duplicated',
        error: 'Error',
        environment: 'Environment',
        flow: 'Flow',
        folder: 'Folder',
        folder_create: 'Create new folder',
        folders: 'Folders',
        from: 'From',
        to: 'To',
        to_group: 'group',
        group: 'Group',
        group_create: 'Create group',
        groups: 'Groups',
        login: 'Login',
        logging_in: 'Logging in',
        logout: 'Logout',
        loading: 'loading',
        user: 'User',
        user_create: 'Create user',
        user_delete: 'Delete user',
        username_exists: 'Username already exists',
        username_free: 'Username %{name} is free',
        username_does_not_exist: 'User %{name} does not exist',
        password: 'Password',
        users: 'Users',
        tag: 'Tag',
        tag_create: 'Create Tag',
        tags: 'Tags',
        monitor: 'Monitor',
        name: 'Name',
        no_internet_connection: 'No internet connection',
        not_found: {
            users: 'No users found',
            user: '%{name} not found'
        },
        save: 'Save',
        saving: 'saving',
        saved: 'saved',
        save_and_reboot: 'Save and reboot',
        search: 'Search',
        search_for: {
            cards: 'Search cards'
        },
        settings: 'Settings',
        select_all_finished_cards: 'Select all finished cards',
        select_all_users: 'Select all users',

        send: 'send',
        shutdown: 'Shutdown',
        system: 'System',
        success: 'Success',
        reset_user_selection: 'Reset User selection',
        update: 'Update',
        update_available: 'Update %{name} available',
        lumi_is_up_to_date: 'Lumi is up to date.',
        password_incorrect: 'Password incorrect',

        data_packages: '%{num} data packages',
        development_over_time: 'Development over time',

        percent: 'Percent',
        short_name: 'Short name',

        average: 'Average',

        color: 'color',

        time: 'Time',
        minute: 'Minute',
        hour: 'Hour',
        day: 'Day',
        month: 'Month',

        reset_password: 'Reset Password',
        set_your_password: 'Set your password',
        repeat_password: 'Repeat password',
        passwords_do_not_match: 'Passwords do not match',
        controlled_mode: 'Controlled mode',

        data_not_synced: 'Data is not synced',
        syncing: 'syncing',
        error_msg: 'An Error occurred',
        edit: 'Edit',
        answer: 'Answer',
        type: 'Type',
        description: 'Description',
        text: 'Text',
        required: '%{item} required',
        drop_here: 'Drop %{item} here',
        files: 'files',
        check: 'Check',
        upload: 'Upload',
        upload_error: 'Upload not successfull',
        lost_connection: 'Lost connection. Please check WiFi',
        grading: 'Grading',
        view: 'View'
    },
    de: {
        activity: 'Aktivittät',
        activity_assignment_completed:
            'hat die Lernkarte %{cardname} mit %{score} beendet.',
        activity_login: 'hat sich angemeldet.',
        activity_comment: 'hat in %{cardname} kommentiert',
        add: 'Hinzufügen',
        add_new_field: 'Neues Feld hinzufügen',
        activities: 'Aktivitäten',
        archive: 'Archivieren',
        archiving: 'archiviere',
        archived: 'archiviert',
        assign: {
            cards: '%{num} Karten zuweisen'
        },
        assigning: 'zuweisen',
        assigned: 'zugewiesen',
        assignment: 'Auftrag',
        assignments: 'Aufträge',
        analytics: 'Analytik',
        back: 'Zurück',
        cancel: 'Abbrechen',
        card: 'Karte',
        card_add: 'Karte hinzufügen',
        card_edit: '%{name} bearbeiten',
        card_create: 'Karte erstellen',
        cards_assign: '%{num} Karten zuweisen',
        cards_assign_explanation:
            'Weise %{num} Karte(n) ganzen Gruppen oder einzelnen Benutzer zu.',
        cards: 'Karten',
        comment: 'Kommentar',
        comments: 'Kommentare',
        comments_no: 'Keine Kommentare',
        continue: 'Weiter',
        create: 'Erstellen',
        creating: 'erstelle',
        created: 'erstellt',
        delete: 'Löschen',
        delete_: '%{item} löschen',
        deleting: 'lösche',
        deleted: 'gelöscht',
        duplicate: 'Duplizieren',
        duplicating: 'dupliziere',
        duplicated: 'dupliziert',
        environment: 'Umgebung',
        error: 'Fehler',
        flow: 'Flow',
        folder: 'Ordner',
        folder_create: 'Neuen Ordner erstellen',
        folders: 'Ordner',
        from: 'Von',
        to: 'Bis',
        to_group: 'Gruppieren',
        group: 'Gruppe',
        group_create: 'Gruppe erstellen',
        groups: 'Gruppen',
        login: 'Anmelden',
        password: 'Passwort',
        logout: 'Abmelden',
        loading: 'lade',
        user: 'Benutzer',
        user_delete: 'Benutzer löschen',
        user_create: 'Benutzer erstellen',
        username_exists: 'Benutzername bereits vergeben',
        username_free: 'Benutzername %{name} ist frei',
        username_does_not_exist: 'Der Benutzer %{name} existiert nicht',
        users: 'Benutzer',
        tag: 'Tag',
        tag_create: 'Tag erstellen',
        tags: 'Tags',
        monitor: 'Monitor',
        name: 'Name',
        no_internet_connection: 'Keine Internetverbindung',
        not_found: {
            users: 'Keine Benutzer gefunden',
            user: '%{name} nicht gefunden'
        },
        save: 'Speichern',
        saving: 'speichere',
        saved: 'gepspeichert',
        save_and_reboot: 'Speichern und neustarten',
        search: 'Suche',
        search_for: {
            cards: 'Karten suchen'
        },
        logging_in: 'Melde an',
        settings: 'Einstellungen',
        select_all_finished_cards: 'Alle abgeschlossenen Aufgaben auswählen',
        select_all_users: 'Alle Benutzer auswählen',
        send: 'Senden',
        shutdown: 'Ausschalten',
        system: 'System',
        success: 'Erfolg',
        reset_user_selection: 'Benutzerauswahl zurücksetzen',
        update: 'Update',

        update_available: 'Update %{name} verfügbar',
        lumi_is_up_to_date: 'Lumi ist auf dem neusten Stand',

        data_packages: '%{num} Datensätze',
        development_over_time: 'Entwicklung über Zeit',
        set_your_password: 'Setze dein Passwort',

        percent: 'Prozent',
        color: 'Farbe',

        average: 'Durchscnitt',
        short_name: 'Kurzname',

        time: 'Zeit',
        minute: 'Minute',
        hour: 'Stunde',
        day: 'Tag',
        month: 'Monat',

        reset_password: 'Passwort zurücksetzen',
        repeat_password: 'Passwort wiederholen',
        passwords_do_not_match: 'Passwörter stimmen nicht überein',
        controlled_mode: 'Kontrollierter Modus',
        password_incorrect: 'Passwort falsch',

        data_not_synced: 'Daten nicht synchronisiert',
        syncing: 'Synchronisiere',
        error_msg: 'Es ist ein Fehler aufgetreten',
        edit: 'Bearbeiten',
        answer: 'Antwort',
        type: 'Typ',
        description: 'Beschreibung',
        text: 'Text',
        required: '%{item} benötigt',
        drop_here: '%{item} hier hinziehen',
        files: 'Dateien',
        check: 'Check',
        upload: 'Hochladen',
        upload_error: 'Hochladen fehlgeschlagen',
        lost_connection:
            'Verbindung verloren. Bitte überprüfe deine WLAN Verbindung',
        grading: 'Bewertung',
        view: 'Ansehen'
    }
};

export default i18n;

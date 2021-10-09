import './style.scss';
import * as Helper from './helper';
import NotesButton from './components/NotesButton/NotesButton';
import REST from './rest'

jQuery(document).ready(async function() {
    if( Helper.isUserRoleNotAllowed() ) { return; }

    Helper.injectNotesPopup();

    await REST.getNotesMeta();

    if( Helper.isGridView() && Helper.isMediaListing() ) {
        let mediaGridContainer = document.querySelector('ul.attachments');
        observerDomMutation(mediaGridContainer, ()=> injectNotesBtn(NotesButton));
    } else {
        Helper.injectNotesBtn(NotesButton);
    }
});
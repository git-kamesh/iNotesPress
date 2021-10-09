import './NotesWidget.scss';
import { h, Component, Fragment } from 'preact';
import AddIcon from '../Icons/VAddSmallIcon';
import { actions, store } from '../../store';
import { bindActions } from "redux-zero/utils";
import Loading from '../Loading/Loading';
import REST from '../../rest';
import VLeftArrow from '../Icons/VLeftArrow';
import { timeSince, i18n } from '../../utils';

export default class NotesWidget extends Component {
    constructor() {
        this.state = {
            notes: [],
            isLoading: true,
            isBtnDisabled: false,
            currentPage: 'home',
            pageID: '',
            pageParam: {},
            note: ''
        };
        this.actions = bindActions(actions, store);
    }

    goTo(currentPage = 'home', pageID = '', params = {}, state = {}) {
        this.setState({ currentPage, pageID, pageParam: params, ...state});
    }

    getEmptyNotesUI() {
        let { isLoading } = this.state;

        return (
            <div class="dfn-notes-empty">
                {   
                    isLoading
                    ?
                        <Loading />
                    : 
                        <Fragment>
                            <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M10.5.5l.354-.354L10.707 0H10.5v.5zm3 3h.5v-.207l-.146-.147-.354.354zm-1 10.5h-10v1h10v-1zM2 13.5v-12H1v12h1zM2.5 1h8V0h-8v1zM13 3.5v10h1v-10h-1zM10.146.854l3 3 .708-.708-3-3-.708.708zM2.5 14a.5.5 0 01-.5-.5H1A1.5 1.5 0 002.5 15v-1zm10 1a1.5 1.5 0 001.5-1.5h-1a.5.5 0 01-.5.5v1zM2 1.5a.5.5 0 01.5-.5V0A1.5 1.5 0 001 1.5h1z" fill="currentColor"></path></svg>
                            <p class="desc">{ i18n('notes.empty') }</p>
                        </Fragment>
                }
            </div>
        );
    }

    getBtnUI(icon, content, action, isBtnDisabled = false) {
        let { isLoading } = this.state;

        return (
            <div onClick={action} class={"dfn-notes-btn" + ((isBtnDisabled || isLoading)? " dfn-disabled" : "")}>
                { icon } { content }
            </div>
        );
    }

    getListItemUI(item) {
        return (
            <div class="dfn-notes-litem" onClick={()=> this.goTo('view-note', item.id)}>
                <div class="dfn-avatar">
                    <img src={ item.avatar } />
                </div>
                <div class="dfn-lright">
                    <div class="dfn-lheader"> <strong>{ item.creator }</strong> - <em>{ timeSince(item.modified_at) }</em></div>
                    <div class="dfn-excerpt">{ item.note }</div>
                </div>
            </div>
        );
    }

    getNotesListUI() {
        return this.state.notes.map((item)=> this.getListItemUI(item));
    }

    getHeaderUI(right='', middle='') {
        let { currentPage } = this.state;

        if(currentPage == 'home') return '';
        
        return (
            <div class="dfn-notes-header" key={currentPage}>
                <div onClick={()=> this.goTo('home')} title="Home" class="dfn-notes-header-back">
                    <VLeftArrow/>
                </div>
                <div class="dfn-notes-header-middle">{ middle }</div>
                <div class="dfn-notes-header-right">{ right }</div>
            </div>
        )
    }
    getHomePage() {
        let { notes, currentPage, isLoading } = this.state;
        return (
            <div class="dfn-notes-widgte" key={currentPage}>
                { this.getHeaderUI() }
                <div class="dfn-notes-body">
                    { (notes.length && !isLoading)? this.getNotesListUI() : this.getEmptyNotesUI() }
                </div>
                { this.getBtnUI(isLoading? '' : <AddIcon />, isLoading? i18n('notes.processing') : i18n('notes.add'), ()=> this.goTo('add-note')) }
            </div>
        );        
    }

    getViewNotePage() {
        let { notes, pageID, currentPage } = this.state;
        let item = notes.find((o)=> o.id == pageID);
        let deleteConsent = {
            title: i18n('notes.delete.title'),
            info: i18n('notes.delete.info'),
            cancel: ()=> this.goTo('view-note', item.id),
            accept: ()=> this.deleteNote(item.id),
            isDelete: true
        }

        return (
            <div class="dfn-notes-widgte" key={currentPage}>
                { 
                    this.getHeaderUI(
                        this.isNoteCreator(item) &&
                        <div>
                            <span class="dbn-action dbn-mR10" onClick={()=> this.goTo('edit-note', item.id, {}, { note: item.note })}>{ i18n('notes.edit') }</span>
                            <span
                                class="dbn-action danger"
                                onClick={()=> this.goTo('consent', item.id, deleteConsent)}>{ i18n('notes.delete') }</span>
                        </div>
                    )
                }
                <div class="dfn-notes-body">
                    { item.note.replace(/(\n|\r)+/g, "\n").split("\n").map((o)=> <p class="content">{o}</p>) }
                </div>
                { this.getBtnUI(<AddIcon />, i18n('notes.add'), ()=> this.goTo('add-note')) }
            </div>
        );        
    }

    getAddNotePage() {
        let { notes, pageID, note, currentPage } = this.state;
        let item = notes.find((o)=> o.id == pageID);

        setTimeout(()=> (this.txtarea && this.txtarea.focus()), 500);

        return (
            <div class="dfn-notes-widgte" key={currentPage}>
                <span  title={i18n('notes.limit')}>
                    { this.getHeaderUI( note && `${note.trim().length}/256`) }
                </span>
                <div class="dfn-notes-body">
                    <textarea 
                        onInput={(e)=> this.setState({ note: e.target.value })}
                        placeholder={ i18n('notes.add.placeholder') } 
                        class="dfn-notes-editor" 
                        maxlength="256" 
                        ref={(o) => { this.txtarea = o }} />
                </div>
                { this.getBtnUI('', i18n('notes.save'), ()=> this.saveNote(), note.trim().length == 0) }
            </div>
        );        
    }

    getEditNotePage() {
        let { notes, pageID, note, currentPage } = this.state;
        let item = notes.find((o)=> o.id == pageID);

        setTimeout(()=> (this.txtarea && this.txtarea.focus()), 500);

        return (
            <div class="dfn-notes-widgte" key={currentPage}>
                { 
                    this.getHeaderUI(
                        note && 
                        <div>
                            <span title={i18n('notes.limit')} class="dbn-mR10">{note.trim().length}/256</span>
                            <span
                                class="dbn-action"
                                onClick={()=> this.goTo('view-note', item.id)}>{ i18n('notes.cancel') }</span>
                        </div>
                    ) 
                }
                <div class="dfn-notes-body">
                    <textarea 
                        onInput={(e)=> this.setState({ note: e.target.value })}
                        placeholder={  i18n('notes.add.placeholder') }
                        class="dfn-notes-editor" 
                        maxlength="256" 
                        value={note}
                        ref={(o) => { this.txtarea = o }} />
                </div>
                { this.getBtnUI('', 'Save Note', ()=> this.updateNote(pageID), note.trim().length == 0) }
            </div>
        );        
    }

    getConsentPage() {
        let { pageID, pageParam, currentPage } = this.state;
        let { isDelete, cancel, accept, title, info } = pageParam;

        return (
            <div class="dfn-notes-widgte" key={currentPage}>
                <div class="dfn-notes-body consent">
                    <div class="holder">
                        <h3 class="dbn-title">{ title }</h3>
                        <div class="dbn-info">{ info }</div>

                        <div class="dbn-actions">
                            <div class="dbn-mR10 dbn-btn cancel" onClick={()=> cancel()}>{ i18n('notes.cancel') }</div>
                            <div class={"dbn-btn " + (isDelete? 'delete' : 'accept')} onClick={()=> accept()}>{ i18n(`notes.${ isDelete? 'delete' : 'accept' }`) }</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    async saveNote() {
        let { id, type } = this.props;
        let { note } = this.state;

        this.setState({ isLoading: true });
        REST.saveNote(type, id, note).then((responce)=> {
            this.setState({ notes: responce.data, isLoading: false });
            this.goTo('home');
        });
    }

    async updateNote(note_id) {
        let { id, type } = this.props;
        let { note } = this.state;

        this.setState({ isLoading: true });
        REST.updateNote(type, id, note_id, note).then((responce)=> {
            this.setState({ notes: responce.data, isLoading: false });
            this.goTo('view-note', note_id);
        });
    }

    async deleteNote(note_id) {
        let { id, type } = this.props;

        this.setState({ isLoading: true });
        REST.deleteNote(type, id, note_id).then((responce)=> {
            this.setState({ notes: responce.data, isLoading: false });
            this.goTo('home');
        });
    }

    componentWillMount() {
        let { id, type } = this.props;
        REST.getNotes(type, id).then((responce)=> {
            this.setState({ notes: responce.data, isLoading: false });
            this.goTo('home');
        });
    }

    isNoteCreator(note) {
        return note.created_by == inotespress_data.user_id;
    }

    render() {
        let { currentPage, isLoading } = this.state;        
        
        if( isLoading || currentPage == 'home') {
            return this.getHomePage();
        } else if(currentPage == 'view-note') {
            return this.getViewNotePage()
        } else if(currentPage == 'add-note') {
            return this.getAddNotePage();
        } else if(currentPage == 'edit-note') {
            return this.getEditNotePage();
        } else if(currentPage == 'consent') {
            return this.getConsentPage();
        }
    }
}
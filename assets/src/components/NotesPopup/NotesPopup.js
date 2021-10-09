import { h } from 'preact';
import { Connect, Provider } from "redux-zero/preact";
import { store, actions } from '../../store';
import './NotesPopup.scss';
import NotesWidget from '../NotesWidget/NotesWidget';

export default function NotesPopup (props){
    var mapToProps = (state) => state;

    return (
        <Provider store={store}>
            <Connect mapToProps={mapToProps} actions={actions}>
            {({ popup, setPopup }) => popup && (
                <div class="dfn-overlay">
                    <div class="dfn-overlay-bg" onClick={()=> setPopup(null)}></div>
                    <NotesWidget id={popup.id} type={popup.type}/>
                </div>
            )}
            </Connect>
        </Provider>
    );
}
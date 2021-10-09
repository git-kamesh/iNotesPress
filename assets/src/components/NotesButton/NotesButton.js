import './NotesButton.scss';
import { h } from 'preact';
import { Connect, Provider } from "redux-zero/preact";
import { store, actions } from '../../store';
import { get, i18n } from '../../utils'
import AddIcon from '../Icons/AddIcon'

export default function NotesButton (props){
    var mapToProps = (state) => state;

    return (
        <Provider store={store}>
            <Connect mapToProps={mapToProps} actions={actions}>
            {({ setPopup, notes_meta }) => {
                let meta = notes_meta.find( (o)=> (o.parent_id == props.id && o.parent_type == props.type) );
                let count = get(meta, 'notes', 0);

                let clickHandler = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setPopup(props);
                };

                return (
                    <span
                        class={"dfn-notebtn dfn-enter-anim" + (count? " static" : "") + (props.grid? ' grid' : '')}
                        title={count? i18n('notes.count', count) : i18n('notes.add')}
                        onMouseDown={clickHandler}
                    >
                        {count ? count : <AddIcon/>}
                    </span>
                );
            }}
            </Connect>
        </Provider>
    );
}
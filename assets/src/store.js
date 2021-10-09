import createStore from 'redux-zero';

let initialState = {
    notes_meta: [],
    notes: [],
    popup: null
};

export const store = createStore(initialState);

export const actions = (store) => ({
    addNotesMeta(state, value) {
        if(typeof value == 'object') {
            return {
                notes_meta: value
            };
        }
    },
    addNotes(state, value) {
        if(typeof value == 'object') {
            return {
                notes: ( state.notes ).concat( value)
            };
        }
    },
    setPopup(state, value) {
        return {
            popup: value
        };
    },
});

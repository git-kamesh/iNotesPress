import { actions, store } from './store';
import { bindActions } from "redux-zero/utils";

class RestHandler {
    constructor(baseurl, headers = {}) {
        this.baseurl = baseurl;
        this.headers = headers;
    }

    request(method, endpoint, data = {}, headers = {}) {
        return new Promise((resolve, reject)=> {
            return fetch(`${this.baseurl}${endpoint}`, {
                method: method,
                ...( !['GET', 'HEAD', 'DELETE'].includes(method)? {body: typeof data == 'object'? JSON.stringify(data) : data } : {}),
                headers: { ...this.headers, ...headers},
            })
            .then(response => resolve(response.json()) )
            .catch(error => reject(error));
        })
    }

    post(endpoint, data = {}, headers = {}) {
        return this.request('POST', endpoint, data, headers)
    }

    get(endpoint, data = {}, headers = {}) {
        return this.request('GET', endpoint, data, headers)
    }

    patch(endpoint, data = {}, headers = {}) {
        return this.request('PATCH', endpoint, data, headers)
    }

    delete(endpoint, data = {}, headers = {}) {
        return this.request('DELETE', endpoint, data, headers)
    }
}

class Rest {
    constructor() {
        let dfn_data = window.inotespress_data;
        let baseurl = `${dfn_data.site_url}/wp-json/inotespress/v1`;
        this.rest = new RestHandler(baseurl, { 'X-WP-Nonce': dfn_data.rest_nonce });
        this.actions = bindActions(actions, store);
    }

    async getNotesMeta() {
        let data = await this.rest.get('/notes/meta');
        this.actions.addNotesMeta(data.data);
    }

    async getNotes(parent, parent_id) {
        return await this.rest.get(`/notes/${parent}/${parent_id}`);
    }

    async saveNote(parent, parent_id, note) {
        let response = await this.rest.post(`/notes/${parent}/${parent_id}`, { note });
        this.getNotesMeta();
        return response;
    }

    async updateNote(parent, parent_id, note_id, note) {
        let response = await this.rest.patch(`/notes/${parent}/${parent_id}/${note_id}`, { note } );
        return response;
    }

    async deleteNote(parent, parent_id, note_id) {
        let response = await this.rest.delete(`/notes/${parent}/${parent_id}/${note_id}`);
        this.getNotesMeta();
        return response;
    }
}

const REST = new Rest();

export default REST;
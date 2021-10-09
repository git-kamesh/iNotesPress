import { h, render } from 'preact';
import { get } from './utils';
import NotesPopup from './components/NotesPopup/NotesPopup';

export function isMediaListing() {
    return document.querySelector('body.wp-admin.upload-php');
}

export function isWooListing() {
    return document.querySelector('body.wp-admin.edit-php.post-type-product.woocommerce-page');
}

export function isPostsListing() {
    return document.querySelector('body.wp-admin.edit-php.post-type-post');
}

export function isPagesListing() {
    return document.querySelector('body.wp-admin.edit-php.post-type-page');
}

export function isGridView() {
    return document.querySelector('body.supports-drag-drop');
}

export function getNoteBtnAreas() {
    if(isGridView() && isMediaListing()) {
        return document.querySelectorAll('ul.attachments li.attachment[data-id]');
    }
    if(isWooListing()) {
        return document.querySelectorAll('.wp-list-table tbody#the-list tr[id] td.name');
    }

    return document.querySelectorAll('.wp-list-table tbody#the-list tr[id] td.title');
}

export function injectNotesBtn(NotesBtn) {

    if( !(isMediaListing() || isPostsListing() || isPagesListing() || isWooListing()) ) {
        return;
    }

    let targets = getNoteBtnAreas();

    // Fix position of parents
    jQuery(targets).each(function() {
        jQuery(this).not('.dfn-parent').addClass('dfn-parent');
    })

    Array.from(targets)
        .forEach((container)=> {
            let type = '';
            let isMediaGrid = (isGridView() && isMediaListing());

            let target = isMediaGrid? jQuery(container) : jQuery(container).parent();
            let id = target.attr(isMediaGrid? 'data-id' : 'id').replace('post-', '');

            if(isMediaListing()) {
                type = 'attachment';
            } else if(isPostsListing() || isWooListing()) {
                type = 'post';
            } else if(isPagesListing()) {
                type = 'page';
            }

            render(<NotesBtn id={id} type={type} grid={isMediaGrid}/>, container);
        });
}


export function injectNotesPopup() {
    render(<NotesPopup />, document.body);
}

export function isUserRoleNotAllowed() {
    let supported = ['administrator', 'editor', 'author', 'contributor'];
    let intersect = get(inotespress_data, 'roles', []).filter(value => supported.includes(value));
    return intersect.length == 0;
}

export function observerDomMutation(target, callback) {
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            callback(mutation);
        });
    });
      
    observer.observe(target, {
        characterDataOldValue: false, 
        subtree: false, 
        childList: true, 
        characterData: false
    });
}
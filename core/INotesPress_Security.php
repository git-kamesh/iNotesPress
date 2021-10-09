<?php 

class INotesPress_Security {

    public static function add_nounce($i18n = []) {
        
        $user = wp_get_current_user();
        $lang = get_locale();

        INotesPress_Asset::inject_data('dfnotes', 'inotespress_data', array(
            'nonce' => wp_create_nonce('inotespress__nonce'),
            'rest_nonce' => wp_create_nonce('wp_rest'),
            'site_url' => site_url(),
            'user_id' => $user->ID,
            'roles' => $user->roles,
            'lang' => $lang,
            'i18n' => $i18n
        ));
    }
}
<?php 

class INotesPress_API {

    public static function get_notes_meta() {
        global $wpdb;

        if( !(new self)->is_admin() ) wp_send_json_error([], 401);

        $query = "SELECT parent_id, parent_type, COUNT(id) AS notes from ".$wpdb->prefix."inotespress GROUP BY parent_type, parent_id;";

        $result = $wpdb->get_results($query);

        wp_send_json_success($result);
    }
    
    public static function get_notes($request) {
        global $wpdb;

        if( !(new self)->is_admin() ) wp_send_json_error([], 401);

        $url_params = $request->get_url_params();

        $query = $wpdb->prepare("SELECT * from ".$wpdb->prefix."inotespress where parent_id = '%s' and parent_type = '%s';", $url_params['id'], $url_params['type']);

        $notes = $wpdb->get_results($query);

        foreach ($notes as $k => $note) {
            $userdata = INotesPress_Helper::get_userdata($note->created_by);
            $notes[$k]->creator = $userdata->display_name;
            $notes[$k]->avatar = INotesPress_Helper::get_avatar_url($userdata->user_email);
            $notes[$k]->modified_at = strtotime($note->modified_at) * 1000;
        }

        wp_send_json_success($notes);
    }
    
    public static function add_note($request) {
        global $wpdb;

        if( !(new self)->is_admin() ) wp_send_json_error([], 401);

        $url_params = $request->get_url_params();

        $body = json_decode($request->get_body(), true);

        $query = "INSERT INTO ".$wpdb->prefix."inotespress(note, parent_id, parent_type, created_by, modified_at) VALUES (%s, %d, %s, %s, %s);";

        $note = $body['note'];
        $parent = $url_params['id'];
        $type = $url_params['type'];
        $creator = get_current_user_id();
        $date = date('Y-m-d H:i:s');

        $notes = $wpdb->query($wpdb->prepare($query, $note, $parent, $type, $creator, $date));

        INotesPress_API::get_notes($request);
    }
    
    public static function update_note($request) {
        global $wpdb;

        if( !(new self)->is_admin() ) wp_send_json_error([], 401);

        $url_params = $request->get_url_params();

        $body = json_decode($request->get_body(), true);

        $query = "UPDATE ".$wpdb->prefix."inotespress SET note=%s, modified_at=%s WHERE id=%s AND created_by=%s";

        $note = $body['note'];
        $creator = get_current_user_id();
        $date = date('Y-m-d H:i:s');

        $notes = $wpdb->query($wpdb->prepare($query, $note, $date, $url_params['noteid'], $creator));

        INotesPress_API::get_notes($request);
    }
    
    public static function delete_note($request) {
        global $wpdb;

        if( !(new self)->is_admin() ) wp_send_json_error([], 401);

        $url_params = $request->get_url_params();

        $query = "DELETE from ".$wpdb->prefix."inotespress WHERE id=%s AND created_by=%s";

        $creator = get_current_user_id();

        $notes = $wpdb->query($wpdb->prepare($query, $url_params['noteid'], $creator));

        INotesPress_API::get_notes($request);
    }

    private static function is_admin() {
        $user = wp_get_current_user();
        return array_intersect(['administrator', 'editor', 'author', 'contributor'], $user->roles);
    }

    public static function delete_note_by_id($type, $id) {
        global $wpdb;
        
        $query = "DELETE from ".$wpdb->prefix."inotespress WHERE parent_type=%s AND parent_id=%s";
        $wpdb->query($wpdb->prepare($query, $type, $id));
    }
}
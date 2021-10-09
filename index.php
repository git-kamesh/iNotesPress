<?php
/*
Plugin Name: iNotesPress
Description: Add shortnotes to Posts, Pages and Attachments. Drag Your Productivity Like a Pro. Sharing & Co-Working
Version: 1.0.0
Author: Kamesh S
*/

/* ---------------------------------------------------- */
/* Basic 												*/
/* ---------------------------------------------------- */
if (!defined('ABSPATH')) {
    die('-1');
}

require_once('constants.php');
require_once('hooks.php');
require_once('api.php');
require_once('i18n.php');

// Register class auto-loader
spl_autoload_register(function ($class) {
    $base_dir = __DIR__ . '/core/';
    $file = str_replace('\\', '/', $base_dir . $class . '.php');

    if (file_exists($file)) {
        require $file;
    }
});

// Plugin Life-cycle Hooks
INotesPress_Plugin::activated( __FILE__, 'INotesPress_Hooks::pluginActivate');

// Plugin Main Body
INotesPress_Action::add('plugins_loaded', function() {

    // REST API
    INotesPress_Action::add( 'rest_api_init', function () {
        $ns = 'inotespress/v1';

        // GET NOTES META
        INotesPress_Rest::add( $ns, 'GET', '/notes/meta', 'INotesPress_API::get_notes_meta' );

        // GET NOTES FOR AN ENTITY
        INotesPress_Rest::add( $ns, 'GET', '/notes/(?P<type>(post|page|attachment))/(?P<id>\d+)', 'INotesPress_API::get_notes' );

        // ADD NOTES FOR AN ENTITY
        INotesPress_Rest::add( $ns, 'POST', '/notes/(?P<type>(post|page|attachment))/(?P<id>\d+)', 'INotesPress_API::add_note' );

        // UPDATE NOTE
        INotesPress_Rest::add( $ns, 'PATCH', '/notes/(?P<type>(post|page|attachment))/(?P<id>\d+)/(?P<noteid>\d+)', 'INotesPress_API::update_note' );

        // DELETE NOTE
        INotesPress_Rest::add( $ns, 'DELETE', '/notes/(?P<type>(post|page|attachment))/(?P<id>\d+)/(?P<noteid>\d+)', 'INotesPress_API::delete_note' );
    });

    INotesPress_Action::add('admin_enqueue_scripts', function() {
        // Plugin Assets Hooks
        INotesPress_Asset::load_script('dfnotes', plugins_url( '/assets/dist/bundle.js', __FILE__ ), ['jquery'], INOTESPRESS_VERSION);

        // Security : Nounce
        INotesPress_Security::add_nounce( inotespress_i18n() );
    });


    // Watch general events
    
    INotesPress_Action::add('before_delete_post', function($id, $post) { // post, page
        INotesPress_API::delete_note_by_id($post->post_type, $id);
    }, 10, 2);

    INotesPress_Action::add('delete_attachment', function($id, $post) { // attachment
        INotesPress_API::delete_note_by_id($post->post_type, $id);
    }, 10, 2);
});
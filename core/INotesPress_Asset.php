<?php

/**
 * INotesPress_Action acts as an wrapper for Wordpress Action API
 * 
 * @since 1.0.0
 */
class INotesPress_Asset {

    /**
     * Adds script to wordpress page
     * 
     * @since 1.0.0
     * @param string $handle (Required) Name of the script. Should be unique.
     * @param string $src Full URL of the script, or path of the script relative to the WordPress root directory.
     * @param string[] $deps An array of registered script handles this script depends on.
     * @param string $ver String specifying script version number
     * @param bool $in_footer Whether to enqueue the script before </body> instead of in the <head>.
     * 
     */
    public static function load_script( $handle, $src = '', $deps = array(), $ver = '', $in_footer = false ) {
        return wp_enqueue_script( $handle, $src, $deps, $ver, $in_footer );
    }

    /**
     * Adds style to wordpress page
     * 
     * @since 1.0.0
     * @param string $handle (Required) Name of the script. Should be unique.
     * @param string $src Full URL of the script, or path of the script relative to the WordPress root directory.
     * @param string[] $deps An array of registered script handles this script depends on.
     * @param string $ver String specifying script version number
     * @param string $media
     * 
     */
    public static function load_style( $handle, $src = '', $deps = array(), $ver = '', $media = 'all') {
        return wp_enqueue_style( $handle, $src, $deps, $ver, $media );
    }

    public static function inject_data($ns, $key, $data) {
        wp_localize_script($ns, $key, $data);
    }
}